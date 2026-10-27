import { useContent } from "./LanguageProvider";
import { LanguageToggle } from "./LanguageToggle";
import { WhatsAppCta } from "./WhatsAppCta";
export function Header() {
  const content = useContent();
  return <header className="site-header">
    <a href="#top" className="site-wordmark" aria-label="Hope Theory Labs — home">{content.header.wordmark}</a>
    <nav className="desktop-nav" aria-label="Primary">
      {content.header.nav.filter((item) => item.href !== "#contact").map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
      <LanguageToggle />
      <a href="#contact" className="nav-contact">{content.header.nav.find((item) => item.href === "#contact")?.label ?? "Contact"}</a>
    </nav>
    <details className="mobile-menu">
      <summary aria-label={content.header.menu}><span></span><span></span></summary>
      <nav aria-label="Mobile primary">{content.header.nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}<LanguageToggle /><WhatsAppCta href={content.hero.whatsappLink}>{content.header.whatsapp}</WhatsAppCta></nav>
    </details>
  </header>;
}
