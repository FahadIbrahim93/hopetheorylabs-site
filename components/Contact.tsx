"use client";

import type { FormEvent } from "react";

import { useContent } from "./LanguageProvider";

export function Contact() {
  const content = useContent();
  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const need = String(form.get("need") ?? "").trim();
    const message = "Hi Hope Theory Labs, I’m " + (name || "a visitor") + ". " + need;
    window.open("https://wa.me/8801718463471?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
  }
  return (
    <section id="contact" className="contact-section border-b border-paper/10" aria-labelledby="contact-heading">
      <div className="contact-grid contact-grid-html">
        <div className="contact-intro scene-copy">
          <p className="eyebrow">{content.contact.eyebrow}</p>
          <h2 id="contact-heading">{content.contact.heading}</h2>
          <p>{content.contact.note}</p>
          <form className="contact-form" onSubmit={sendMessage}>
            <label>
              {content.contact.nameLabel}
              <input name="name" autoComplete="name" />
            </label>
            <label>
              {content.contact.needLabel}
              <textarea name="need" rows={3} />
            </label>
            <button className="primary-cta" type="submit">
              {content.contact.submit}
            </button>
          </form>
          <div className="contact-links">
            <a className="primary-cta" href={content.contact.phoneHref} target="_blank" rel="noopener noreferrer">
              {content.contact.whatsappCta}
            </a>
            <a className="text-link" href={"mailto:" + content.contact.email}>
              {content.contact.email}
            </a>
          </div>
          <p className="contact-phone">{content.contact.phone}</p>
        </div>
      </div>
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...content.footer.ticker, ...content.footer.ticker].map((item, i) => (
            <span key={item + "-" + i}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
