import { useContent } from "./LanguageProvider";

import { LanguageToggle } from "./LanguageToggle";
import { WhatsAppCta } from "./WhatsAppCta";

/*
  Sticky header. Solid ink (no glassmorphism), 1px hairline bottom rule.
  The mobile menu is a native <details> element: works with no JavaScript,
  keyboard focusable, and exposes its expanded state to assistive tech.
*/
export function Header() {
  const content = useContent();
  return (
    <header className="sticky top-0 z-50 border-b border-paper/10 bg-ink">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6 md:px-8"
      >
        <a
          href="#main"
          className="font-heading text-lg tracking-[-0.03em] text-paper"
          aria-label="Hope Theory Labs — back to top"
        >
          {content.header.wordmark}
          <span className="text-teal">.</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {content.header.nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-paper/80 hover:text-paper"
            >
              {link.label}
            </a>
          ))}
          <LanguageToggle />
          <WhatsAppCta href={content.hero.whatsappLink} size="sm">
            {content.header.whatsapp}
          </WhatsAppCta>
        </div>

        <details className="group relative md:hidden">
          <summary
            aria-label={content.header.menu}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-paper hover:bg-paper/10"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5 group-open:hidden"
            >
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="hidden h-5 w-5 group-open:block"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </summary>
          <div className="absolute right-0 top-12 w-64 border border-paper/15 bg-ink p-4">
            <ul>
              {content.header.nav.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block py-2 text-sm text-paper/80 hover:text-paper"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-paper/10 pt-3">
              <LanguageToggle />
              <WhatsAppCta href={content.hero.whatsappLink} size="sm">
                {content.header.whatsapp}
              </WhatsAppCta>
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
