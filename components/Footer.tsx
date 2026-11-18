"use client";

import { useEffect, useRef } from "react";

import { useContent } from "./ContentProvider";

export function Footer() {
  const content = useContent();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const root = document.documentElement;
    // Hide fixed HUD/rail slightly before the footer reaches them.
    const observer = new IntersectionObserver(
      ([entry]) => root.classList.toggle("footer-in-view", Boolean(entry?.isIntersecting)),
      { rootMargin: "0px 0px 120px 0px" },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      root.classList.remove("footer-in-view");
    };
  }, []);
  return (
    <footer ref={ref} className="site-footer">
      <p>{content.footer.text}</p>
      <nav className="footer-nav" aria-label={content.footer.navLabel}>
        {content.footer.nav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <nav className="footer-nav footer-social" aria-label="Social">
        <a href={content.footer.social.href} target="_blank" rel="noopener noreferrer" aria-label={content.footer.social.aria}>
          {content.footer.social.label}
        </a>
      </nav>
      <span>HTL / END OF TRANSMISSION</span>
    </footer>
  );
}
