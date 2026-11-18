#!/usr/bin/env node
/**
 * Design-token gate — issue #50 follow-up.
 *
 * The palette and font pair are a written decision (docs/BRAND.md, locked in
 * #48/#52). This script is the machine-readable half of that decision: `npm
 * test` fails if the CSS drifts away from it, if a pair drops below WCAG AA,
 * or if a retired accent comes back. Values mirror BRAND.md — change both
 * together, in one PR.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = join(root, "app/globals.css");
const css = readFileSync(cssPath, "utf8");

const failures = [];
const ok = (message) => console.log(`  ok   ${message}`);
const fail = (message) => {
  failures.push(message);
  console.log(`  FAIL ${message}`);
};

function blockOf(selector) {
  const start = css.indexOf(selector);
  if (start === -1) return "";
  const open = css.indexOf("{", start);
  const close = css.indexOf("\n}", open);
  return css.slice(open + 1, close === -1 ? css.length : close);
}

const theme = blockOf("@theme");
const rootTokens = blockOf(":root");

function token(block, name) {
  const match = block.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`));
  return match ? match[1].trim() : null;
}

/* The written decision. Values are lowercase hex, as they appear in CSS. */
const PALETTE = {
  "color-page": { value: "#07090c", role: "page background and ink on light surfaces" },
  "color-body": { value: "#eef0f2", role: "body text on the page" },
  "color-muted": { value: "#a3acb8", role: "muted labels and secondary copy" },
  "color-line": { value: "#2a323d", role: "hairlines and decorative rules" },
  "color-line-control": { value: "#6b7685", role: "control and input boundaries" },
  "color-navy": { value: "#0f1b2d", role: "cards and the theme colour" },
  "color-gold": { value: "#b8892f", role: "the single accent" },
  "color-gold-dark": { value: "#8a6420", role: "gold text on light surfaces" },
};

const LIGHT_SURFACE = "#f8f6f1"; // paper, docs/BRAND.md
const INPUT_GROUND = "#0e131a"; // .contact-form input background
const NAVY = "#0f1b2d"; // cards, panels, pricing, theme colour

console.log("\nPalette — @theme must match docs/BRAND.md");
for (const [name, { value, role }] of Object.entries(PALETTE)) {
  const declared = token(theme, name);
  if (!declared) {
    fail(`@theme is missing --${name} (${role})`);
    continue;
  }
  if (declared.toLowerCase() !== value) {
    fail(`@theme --${name} is ${declared}, expected ${value} (${role})`);
  } else {
    ok(`--${name} ${value}`);
  }
  const override = token(rootTokens, name);
  if (override && override.toLowerCase() !== value) {
    fail(`:root --${name} is ${override}, but @theme says ${value}`);
  }
}

console.log("\nStructure tokens — @theme");
for (const name of ["color-line", "color-line-control", "color-navy"]) {
  const declared = token(theme, name);
  if (!declared) fail(`@theme is missing --${name} (see PALETTE)`);
  else ok(`--${name} ${declared.toLowerCase()}`);
}

const hex = (value) => {
  if (value.startsWith("#")) return value.toLowerCase();
  const fromToken = token(theme, value) ?? token(rootTokens, value);
  if (!fromToken || !fromToken.startsWith("#")) return null;
  return fromToken.toLowerCase();
};

const luminance = (value) => {
  const clean = value.replace("#", "");
  const channels = [0, 2, 4].map((index) => parseInt(clean.slice(index, index + 2), 16) / 255);
  const linear = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
};

const ratio = (a, b) => {
  const [first, second] = [luminance(a), luminance(b)].sort((left, right) => right - left);
  return (first + 0.05) / (second + 0.05);
};

const PAIRS = [
  ["color-body", "color-page", 4.5, "body text on the page"],
  ["color-muted", "color-page", 4.5, "muted text on the page"],
  ["color-gold", "color-page", 4.5, "gold text on the page"],
  ["color-body", NAVY, 4.5, "body text on navy cards"],
  ["color-gold", NAVY, 4.5, "pricing price on navy cards"],
  ["color-gold-dark", LIGHT_SURFACE, 4.5, "gold text on light surfaces"],
  ["color-line-control", INPUT_GROUND, 3, "input border against its own ground"],
  ["color-line-control", "color-page", 3, "control border against the page"],
  ["color-line-control", NAVY, 3, "control border on navy cards and panels"],
];

console.log("\nContrast — WCAG 2.2 AA floors");
for (const [foreground, background, floor, label] of PAIRS) {
  const fg = hex(foreground);
  const bg = hex(background);
  if (!fg || !bg) {
    fail(`${label}: could not resolve ${!fg ? foreground : background}`);
    continue;
  }
  const value = ratio(fg, bg);
  const line = `${value.toFixed(2)}:1 (floor ${floor}:1) — ${label}`;
  if (value < floor) fail(line);
  else ok(line);
}

console.log("\nRetired colours — no teal, no second accent");
const RETIRED = [
  ["#ffbd61", "retired amber (issue #50)"],
  ["#7fd6c2", "teal assistant status"],
  ["#14b8a6", "teal"],
  ["#2dd4bf", "teal"],
  ["#0f766e", "teal"],
];

const SOURCE_DIRS = ["app", "components", "content"];
const SOURCE_EXT = new Set([".css", ".ts", ".tsx"]);

function walk(directory, files = []) {
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      walk(full, files);
    } else if (SOURCE_EXT.has(extname(entry))) {
      files.push(full);
    }
  }
  return files;
}

const sourceFiles = SOURCE_DIRS.flatMap((directory) => walk(join(root, directory)));
const retirements = RETIRED.map(([value, why]) => ({ value, why }));
for (const file of sourceFiles) {
  const source = readFileSync(file, "utf8").toLowerCase();
  const relative = file.slice(root.length + 1);
  for (const { value, why } of retirements) {
    if (source.includes(value)) fail(`${relative} still uses ${value} — ${why}`);
  }
  if (/\b(?:teal|cyan|mint)\b/.test(source)) {
    fail(`${relative} mentions teal/cyan/mint — docs/BRAND.md forbids a second accent`);
  }
}
if (!failures.some((message) => message.includes("teal") || message.includes("#ffbd61"))) {
  ok("no retired accent in app/, components/ or content/");
}

console.log("\nTypography — one loaded pair (Instrument Sans + Newsreader)");
const sans = (token(theme, "font-sans") ?? "").toLowerCase();
const heading = (token(theme, "font-heading") ?? "").toLowerCase();
const mono = (token(theme, "font-mono") ?? "").toLowerCase();

if (sans.includes("instrument-sans") && !sans.includes("inter")) ok("--font-sans → Instrument Sans");
else fail(`--font-sans is "${sans}" — expected Instrument Sans, without Inter`);

if (heading.includes("newsreader") && !heading.includes("space-grotesk")) ok("--font-heading → Newsreader");
else fail(`--font-heading is "${heading}" — expected Newsreader, without Space Grotesk`);

if (mono.includes("ui-monospace")) ok("--font-mono → system monospace");
else fail(`--font-mono is "${mono}" — expected the system monospace stack`);

const stray = sourceFiles.find((file) => /--font-(?:inter|space-grotesk)\b/i.test(readFileSync(file, "utf8")));
if (stray) fail(`${stray.slice(root.length + 1)} still references a retired webfont variable`);

console.log("");
if (failures.length) {
  console.error(`Design tokens: ${failures.length} failure(s).`);
  process.exit(1);
}
console.log("Design tokens: all checks passed.");
