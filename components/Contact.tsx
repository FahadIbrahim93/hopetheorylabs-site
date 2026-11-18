"use client";

import { useRef, useState, type FormEvent } from "react";

import { buildContactMessage, whatsappUrl } from "../lib/whatsapp";

import { SectionMarker } from "./SectionMarker";
import { useContent } from "./ContentProvider";

type FieldName = "name" | "objective";

export function Contact({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const content = useContent();
  const { contact } = content;
  const Heading = (headingLevel === 1 ? "h1" : "h2") as "h1" | "h2";
  const [workType, setWorkType] = useState(contact.typeOptions[contact.typeOptions.length - 1]);
  const [timeframe, setTimeframe] = useState(contact.timeframeOptions[0]);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const objectiveRef = useRef<HTMLTextAreaElement>(null);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const objective = String(form.get("objective") ?? "").trim();

    // Name and goal are required. Show the error under the field and move focus
    // to the first one that is empty; nothing opens until both are filled in.
    const next: Partial<Record<FieldName, string>> = {};
    if (!name) next.name = contact.nameError;
    if (!objective) next.objective = contact.objectiveError;
    setErrors(next);
    if (next.name) return void nameRef.current?.focus();
    if (next.objective) return void objectiveRef.current?.focus();

    const href = whatsappUrl(
      buildContactMessage({ name, kind: workType, goal: objective, timing: timeframe }),
    );
    // A real anchor click keeps the user gesture (popup blockers) and opens the
    // chat in a new tab without giving it access to this page.
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  }

  function clearError(field: FieldName) {
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  }

  return (
    <section id="contact" className="contact-section border-b border-body/10" aria-labelledby="contact-heading">
      <SectionMarker index="009" />
      <div className="contact-grid contact-grid-html">
        <div className="contact-intro scene-copy">
          <p className="eyebrow">{contact.eyebrow}</p>
          <Heading id="contact-heading">{contact.heading}</Heading>
          <p>{contact.note}</p>
          <form className="contact-form" onSubmit={sendMessage} noValidate>
            <label>
              {contact.nameLabel}
              <input
                ref={nameRef}
                name="name"
                autoComplete="name"
                required
                aria-required="true"
                aria-invalid={errors.name ? "true" : undefined}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                onChange={() => clearError("name")}
              />
              {errors.name ? (
                <span id="contact-name-error" className="field-error" role="alert">{errors.name}</span>
              ) : null}
            </label>
            <label>
              {contact.typeLabel}
              <select name="workType" value={workType} onChange={(event) => setWorkType(event.target.value)}>
                {contact.typeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <label>
              {contact.objectiveLabel}
              <textarea
                ref={objectiveRef}
                name="objective"
                rows={3}
                required
                aria-required="true"
                aria-invalid={errors.objective ? "true" : undefined}
                aria-describedby={errors.objective ? "contact-objective-error" : undefined}
                onChange={() => clearError("objective")}
              />
              {errors.objective ? (
                <span id="contact-objective-error" className="field-error" role="alert">{errors.objective}</span>
              ) : null}
            </label>
            <label>
              {contact.timeframeLabel}
              <select name="timeframe" value={timeframe} onChange={(event) => setTimeframe(event.target.value)}>
                {contact.timeframeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
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
