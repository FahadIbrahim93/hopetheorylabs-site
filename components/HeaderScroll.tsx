"use client";

import { useEffect } from "react";

export function HeaderScroll() {
  useEffect(() => {
    const header = document.querySelector(".site-header");
    if (!header) return;
    let tick = false;
    const onScroll = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        tick = false;
        header.classList.toggle("is-scrolled", window.scrollY > 40);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
