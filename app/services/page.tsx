"use client";

import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionMarker } from "@/components/SectionMarker";
import { useContent } from "@/components/LanguageProvider";

function ServicesContent() {
  const content = useContent();
  const { services } = content;

  return (
    <section id="services" className="services-section border-b border-paper/10" aria-labelledby="services-heading">
      <SectionMarker index="services" />
      <div className="services-inner scene-copy">
        <p className="eyebrow">{services.eyebrow}</p>
        <h2 id="services-heading">{services.heading}</h2>
        <p>{services.intro}</p>

        <div className="services-lane">
          <h3 className="services-lane-label">{services.websiteLane.label}</h3>
          <ul className="services-list" role="list">
            {services.websiteLane.items.map((item) => (
              <li key={item.title} className="services-item">
                <h3 className="services-item-title">{item.title}</h3>
                <p className="services-item-desc">{item.description}</p>
              </li>
            ))}
          </ul>
          <p className="services-note">{services.websiteLane.note}</p>
        </div>

        <div className="services-lane">
          <h3 className="services-lane-label">{services.aiLane.label}</h3>
          <p className="services-lane-tag">{services.aiLane.tag}</p>
          <ul className="services-list" role="list">
            {services.aiLane.items.map((item) => (
              <li key={item.title} className="services-item">
                <h3 className="services-item-title">{item.title}</h3>
                <p className="services-item-desc">{item.description}</p>
              </li>
            ))}
          </ul>
          <p className="services-note">{services.aiLane.note}</p>
          <a className="primary-cta" href={services.aiLane.whatsappLink} target="_blank" rel="noopener noreferrer">
            {services.aiLane.whatsappCta}
          </a>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <LanguageProvider>
      <div className="site-shell">
        <Header />
        <main id="main" tabIndex={-1}>
          <ServicesContent />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
