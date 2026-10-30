"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AssistantCopy } from "@/content/types";
import { matchFaq } from "@/lib/assistant/kb";

export interface AssistantPanelProps {
  copy: AssistantCopy;
  /** Base wa.me link, e.g. https://wa.me/8801718463471 */
  whatsapp: string;
  email: string;
  calcomUrl?: string;
  onClose: () => void;
}

type Role = "user" | "assistant";
interface Bubble {
  id: number;
  role: Role;
  content: string;
}
type Step = "name" | "contact" | "need" | "summary";

const MAX_CHARS = 1000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d][\d\s()\-]{6,19}$/;

function hasBangla(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

export default function AssistantPanel({ copy, whatsapp, email, calcomUrl, onClose }: AssistantPanelProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([{ id: 0, role: "assistant", content: copy.intro }]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"chat" | "enquiry">("chat");
  const [step, setStep] = useState<Step>("name");
  const [form, setForm] = useState({ name: "", contact: "", need: "" });
  const [field, setField] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<{ kind: "saved" | "failed"; text: string } | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const nextId = useRef(1);
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLAnchorElement>(null);

  const push = useCallback((role: Role, content: string) => {
    setBubbles((current) => [...current, { id: nextId.current++, role, content }]);
  }, []);

  useEffect(() => {
    if (mode === "chat") inputRef.current?.focus();
    else if (step === "summary") summaryRef.current?.focus();
    else fieldRef.current?.focus();
  }, [mode, step]);

  useEffect(() => {
    const node = logRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [bubbles, busy, mode, step, note, warning]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const root = panelRef.current;
      if (!root) return;
      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => node.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const send = async (raw: string) => {
    const message = raw.trim();
    if (!message || busy) return;
    if (message.length > MAX_CHARS) {
      setWarning(copy.tooLong);
      return;
    }
    setWarning(null);
    const history: Bubble[] = [...bubbles, { id: nextId.current++, role: "user", content: message }];
    setBubbles(history);
    setDraft("");
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: history.slice(-12).map(({ role, content }) => ({ role, content })),
        }),
      });
      if (response.status === 429) {
        push("assistant", copy.rateLimited);
        return;
      }
      if (!response.ok) throw new Error("chat_failed");
      const data = (await response.json()) as { reply?: string };
      push("assistant", data.reply?.trim() || copy.error);
    } catch {
      push("assistant", matchFaq(message).reply);
    } finally {
      setBusy(false);
    }
  };

  const startEnquiry = () => {
    setMode("enquiry");
    setStep("name");
    setField("");
    setNote(null);
    setWarning(null);
  };

  const leaveEnquiry = () => {
    setMode("chat");
    setStep("name");
    setField("");
    setNote(null);
    setWarning(null);
  };

  const nextStep = (event: React.FormEvent) => {
    event.preventDefault();
    const value = field.trim();
    if (!value) {
      setWarning(copy.enquiry.required);
      return;
    }
    if (step === "contact" && !EMAIL.test(value) && !PHONE.test(value)) {
      setWarning(copy.enquiry.required);
      return;
    }
    setWarning(null);
    if (step === "name") {
      setForm((current) => ({ ...current, name: value }));
      setStep("contact");
    } else if (step === "contact") {
      setForm((current) => ({ ...current, contact: value }));
      setStep("need");
    } else if (step === "need") {
      setForm((current) => ({ ...current, need: value }));
      setStep("summary");
    }
    setField("");
  };

  const summaryMessage = `Hi Hope Theory Labs, I'm ${form.name}. ${form.need} Contact: ${form.contact}`;
  const whatsappHref = `${whatsapp}?text=${encodeURIComponent(summaryMessage)}`;
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(copy.enquiry.emailSubject)}&body=${encodeURIComponent(summaryMessage)}`;

  const saveEnquiry = async () => {
    if (saving) return;
    setSaving(true);
    setNote(null);
    const lang = hasBangla(`${form.name} ${form.contact} ${form.need}`) ? "bn" : "en";
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          contact: form.contact,
          need: form.need,
          lang,
          website: honeypot,
        }),
      });
      const data = (await response.json().catch(() => null)) as { saved?: boolean } | null;
      if (response.ok && data?.saved) setNote({ kind: "saved", text: copy.enquiry.saved });
      else setNote({ kind: "failed", text: copy.enquiry.saveFailed });
    } catch {
      setNote({ kind: "failed", text: copy.enquiry.saveFailed });
    } finally {
      setSaving(false);
    }
  };

  const stepQuestion =
    step === "name" ? copy.enquiry.name : step === "contact" ? copy.enquiry.contact : copy.enquiry.need;

  return (
    <div
      className="asst-p"
      role="dialog"
      aria-modal="true"
      aria-labelledby="asst-title"
      aria-describedby="asst-privacy"
      ref={panelRef}
    >
      <div className="asst-h">
        <h2 id="asst-title">{copy.title}</h2>
        <button type="button" className="asst-x" onClick={onClose} aria-label={copy.close}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </div>

      <div className="asst-log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions text">
        {bubbles.map((bubble) => (
          <p key={bubble.id} className={bubble.role === "user" ? "asst-m asst-me" : "asst-m"}>
            {bubble.content}
          </p>
        ))}
        {busy ? (
          <p className="asst-m asst-typing" aria-hidden="true">
            ···
          </p>
        ) : null}
        {note ? (
          <p className={note.kind === "saved" ? "asst-n asst-ok" : "asst-n"} role="status">
            {note.text}
          </p>
        ) : null}
        {warning ? (
          <p className="asst-n" role="alert">
            {warning}
          </p>
        ) : null}
      </div>

      {mode === "chat" ? (
        <>
          {bubbles.length === 1 ? (
            <div className="asst-chips">
              {copy.chips.map((chip, index) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => (index === copy.chips.length - 1 ? startEnquiry() : void send(chip))}
                >
                  {chip}
                </button>
              ))}
            </div>
          ) : null}

          <form
            className="asst-compose"
            onSubmit={(event) => {
              event.preventDefault();
              void send(draft);
            }}
          >
            <label className="asst-sr" htmlFor="asst-input">
              {copy.inputLabel}
            </label>
            <input
              id="asst-input"
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={copy.placeholder}
              maxLength={MAX_CHARS}
              autoComplete="off"
            />
            <button type="submit" disabled={busy || !draft.trim()}>
              {busy ? copy.sending : copy.send}
            </button>
          </form>

          {calcomUrl ? (
            <a className="asst-book" href={calcomUrl} target="_blank" rel="noopener noreferrer">
              {copy.booking}
            </a>
          ) : null}
        </>
      ) : (
        <div className="asst-enq">
          {step === "summary" ? (
            <>
              <p className="asst-step">{copy.enquiry.summary}</p>
              <dl className="asst-sum">
                <div>
                  <dt>{copy.enquiry.name}</dt>
                  <dd>{form.name}</dd>
                </div>
                <div>
                  <dt>{copy.enquiry.contact}</dt>
                  <dd>{form.contact}</dd>
                </div>
                <div>
                  <dt>{copy.enquiry.need}</dt>
                  <dd>{form.need}</dd>
                </div>
              </dl>
              <div className="asst-acts">
                <a
                  className="asst-btn asst-primary"
                  ref={summaryRef}
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {copy.enquiry.sendWhatsApp}
                </a>
                <a className="asst-btn" href={mailtoHref}>
                  {copy.enquiry.email}
                </a>
                <button type="button" className="asst-btn" onClick={() => void saveEnquiry()} disabled={saving}>
                  {saving ? copy.enquiry.saving : copy.enquiry.save}
                </button>
              </div>
            </>
          ) : (
            <form className="asst-fstep" onSubmit={nextStep}>
              <label className="asst-step" htmlFor="asst-field">
                {stepQuestion}
              </label>
              <input
                id="asst-field"
                ref={fieldRef}
                value={field}
                onChange={(event) => setField(event.target.value)}
                autoComplete={step === "name" ? "name" : step === "contact" ? "tel" : "off"}
                inputMode={step === "contact" ? "email" : undefined}
                maxLength={step === "need" ? 600 : 120}
              />
              <div className="asst-acts">
                <button type="submit" className="asst-btn asst-primary">
                  {copy.send}
                </button>
                <button type="button" className="asst-btn" onClick={leaveEnquiry}>
                  {copy.enquiry.back}
                </button>
              </div>
            </form>
          )}
          <input
            className="asst-hp"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
            name="website"
          />
        </div>
      )}

      <p className="asst-note" id="asst-privacy">
        {copy.privacy}
      </p>
    </div>
  );
}
