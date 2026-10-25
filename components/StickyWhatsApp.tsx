"use client";
import { useEffect, useState } from "react";
export function StickyWhatsApp({ href, label }: { href: string; label: string }) {
  const [contactVisible, setContactVisible] = useState(false);
  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => setContactVisible(Boolean(entries[0]?.isIntersecting)), { threshold: 0.35 });
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);
  return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={"floating-whatsapp " + (contactVisible ? "is-hidden" : "")}>
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.7-5.2A8.5 8.5 0 1 1 21 12z"/></svg>
  </a>;
}
