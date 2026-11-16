"use client";

import { useState, type FormEvent } from "react";

import { SectionMarker } from "./SectionMarker";
import { useContent } from "./ContentProvider";

export function Contact({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const content = useContent();
  const { contact } = content;
  const Heading = (headingLevel === 1 ? "h1" : "h2") as "h1" | "h2";
  const [workType, setWorkType] = useState(contact.typeOptions[contact.typeOptions.length - 1]);
  const [timeframe, setTimeframe] = useState(contact.timeframeOptions[0]);
  const [replyOn, setReplyOn] = useState(contact.replyOptions[0]);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const objective = String(form.get("objective") ?? "").trim();
    const message = [
      "Hi Hope Theory Labs, I'm " + (name || "a visitor") + ".",
      contact.typeLabel + " " + workType,
      contact.objectiveLabel + " " + (objective || "—"),
      contact.timeframeLabel + " " + timeframe,
      contact.replyLabel + " " + replyOn,
    ].join("\n");
    window.open("https://wa.me/8801718463471?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
  }

  return (
    <section id="contact" className="contact-section border-b border-paper/10" aria-labelledby="contact-heading">
      <SectionMarker index="009" />
      <div className="contact-grid contact-grid-html">
        <div className="contact-intro scene-copy">
          <p className="eyebrow">{contact.eyebrow}</p>
          <Heading id="contact-heading">{contact.heading}</Heading>
          <p>{contact.note}</p>
          <form className="contact-form" onSubmit={sendMessage}>
            <label>
              {contact.nameLabel}
              <input name="name" autoComplete="name" />
            </label>
            <label>
              {contact.typeLabel}
              <select name="workType" value={workType} onChange={(event) => setWorkType(event.target.value)}>
                {contact.typeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <label>
              {contact.objectiveLabel}
              <textarea name="objective" rows={3} />
            </label>
            <label>
              {contact.timeframeLabel}
              <select name="timeframe" value={timeframe} onChange={(event) => setTimeframe(event.target.value)}>
                {contact.timeframeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <label>
              {contact.replyLabel}
              <select name="replyOn" value={replyOn} onChange={(event) => setReplyOn(event.target.value)}>
                {contact.replyOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <button className="primary-cta" type="submit">
              {contact.submit}
            </button>
          </form>
          <div className="contact-links">
            <a className="primary-cta" href={contact.phoneHref} target="_blank" rel="noopener noreferrer">
              {contact.whatsappCta}
            </a>
            <a className="text-link" href={"mailto:" + contact.email}>
              {contact.email}
            </a>
          </div>
          <p className="contact-phone">{contact.phone}</p>
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
