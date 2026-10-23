"use client";

import { useEffect, useState } from "react";

/*
  Round WhatsApp button, bottom-right, safe-area aware. Hidden while the
  Contact section is in view (SPEC §0/Sticky). Plain show/hide — no animation
  until Step 5 adds motion rules (and none under prefers-reduced-motion).
*/
const chatIcon = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-6 w-6"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
  </svg>
);

export function StickyWhatsApp({ href, label }: { href: string; label: string }) {
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setContactVisible(entry.isIntersecting);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={href}
      aria-label={label}
      className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-teal text-ink hover:opacity-90 ${
        contactVisible ? "hidden" : ""
      }`}
    >
      {chatIcon}
    </a>
  );
}
