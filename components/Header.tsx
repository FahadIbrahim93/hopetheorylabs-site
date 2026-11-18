"use client";

import { BrandMark } from "./BrandMark";
import { useContent } from "./ContentProvider";
import { WhatsAppCta } from "./WhatsAppCta";

/*
  Route-aware header: every href is root-relative (`/services`, `/#work`), so the
  same links work from the homepage and from the dedicated routes.
*/
export function Header() {
  const content = useContent();
  const { header } = content;
  return <header className="site-header">
    <a href={header.homeHref} className="site-wordmark" aria-label={`${header.wordmark} — home`}>
      <BrandMark className="site-wordmark-mark" />
      <span className="site-wordmark-text">{header.wordmark}</span>
    </a>
    <nav className="desktop-nav" aria-label="Primary">
      {header.nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
      <a href={header.cta.href} className="nav-contact">{header.cta.label}</a>
    </nav>
    <details className="mobile-menu">
      <summary aria-label={header.menu}><span></span><span></span></summary>
      <nav aria-label="Mobile primary">
        {header.nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        <a href={header.cta.href} className="nav-contact">{header.cta.label}</a>
        <WhatsAppCta href={content.hero.whatsappLink}>{header.whatsapp}</WhatsAppCta>
      </nav>
    </details>
  </header>;
}
