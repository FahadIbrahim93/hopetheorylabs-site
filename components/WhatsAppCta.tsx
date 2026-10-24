import type { ReactNode } from "react";

/*
  Shared WhatsApp call-to-action. Teal button, ink text, 44px minimum height.
  The crisp focus ring comes from the global :focus-visible rule in globals.css.
  Copy and href always come from the caller (content files).
  Step 5: the icon nudges right and a small chat bubble draws in on
  hover/focus (pure CSS, .cta tokens in globals.css).
*/
const sizes = {
  sm: "px-3 py-2 text-xs",
  md: "px-5 py-3 text-sm",
} as const;

export function WhatsAppCta({
  href,
  children,
  className = "",
  size = "md",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  size?: keyof typeof sizes;
}) {
  return (
    <a
      href={href}
      className={`cta group inline-flex min-h-11 items-center gap-2 rounded-md bg-teal font-semibold text-ink hover:opacity-90 ${sizes[size]} ${className}`}
    >
      <span className="relative">
        <span className="cta-bubble" aria-hidden="true" />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="cta-icon h-4 w-4"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
        </svg>
      </span>
      {children}
    </a>
  );
}
