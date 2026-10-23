import { en as content } from "@/content/en";

export function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-8">
        <p className="font-mono text-xs text-paper/50">{content.footer.text}</p>
      </div>
    </footer>
  );
}
