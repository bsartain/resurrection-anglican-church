"use client";
import { useEffect, useMemo, useRef } from "react";
import { usePrimaryLiturgyDrawer } from "../context/LiturgyDrawerContext";
import type { LiturgySection } from "../lib/liturgyMarkup";
import { jumpToSection } from "../lib/liturgyScroll";

// Headless companion to the liturgy page. It renders nothing: the sections stay
// server-rendered (so they print and index), and this only tracks which one is
// being read, remembers it across reloads, and hands the outline to the drawer.
//
// The liturgy page is a server component and can't touch context directly, so it
// renders this and passes the resolved outline down as a prop.
export default function LiturgyReader({ sections, planId }: Readonly<{ sections: LiturgySection[]; planId: string | null }>) {
  const { setDrawerContent, setActiveSlug } = usePrimaryLiturgyDrawer();
  const hasRestored = useRef(false);

  // Sections are rebuilt on every server render, so depend on their identity
  // rather than the array reference to avoid tearing down the observer needlessly.
  const slugKey = useMemo(() => sections.map((section) => section.slug).join(","), [sections]);

  // Scoping the key to the plan means a new week never restores you into last
  // week's service, which would silently show the wrong section.
  const storageKey = planId ? `liturgy:${planId}:section` : null;

  useEffect(() => {
    setDrawerContent(sections);
  }, [sections, setDrawerContent]);

  useEffect(() => {
    if (!sections.length) return;

    const elements = sections.map((section) => document.getElementById(section.slug)).filter((el): el is HTMLElement => el !== null);

    if (!elements.length) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        });

        if (!visible.size) return;

        // At a boundary two sections straddle the band. Prefer the later one —
        // when you're following along, what's coming is what you want named.
        const active = sections.reduce<string | null>((chosen, section) => (visible.has(section.slug) ? section.slug : chosen), null);

        if (!active) return;

        setActiveSlug(active);
        if (storageKey && hasRestored.current) {
          try {
            sessionStorage.setItem(storageKey, active);
          } catch {
            // Private browsing can reject writes; losing the position is survivable.
          }
        }
      },
      {
        // A narrow band across the upper third of the viewport, so "active" means
        // what you're reading rather than whatever just scrolled into view.
        rootMargin: "-15% 0px -70% 0px",
        threshold: 0,
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [slugKey, sections, setActiveSlug, storageKey]);

  // Restore once per mount. A #hash in the URL is an explicit request and always
  // wins; otherwise fall back to where this device left off. A clean first visit
  // stays at the top so the hero still greets people who arrive early.
  useEffect(() => {
    if (hasRestored.current || !sections.length) return;

    const known = new Set(sections.map((section) => section.slug));
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));

    let target: string | null = null;
    if (hash && known.has(hash)) {
      target = hash;
    } else if (storageKey) {
      try {
        const saved = sessionStorage.getItem(storageKey);
        if (saved && known.has(saved)) target = saved;
      } catch {
        // Ignore unavailable storage.
      }
    }

    // Two frames so the browser has settled layout before we measure offsets.
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (target) jumpToSection(target, { instant: true });
        hasRestored.current = true;
      })
    );

    return () => cancelAnimationFrame(frame);
  }, [slugKey, sections, storageKey]);

  return null;
}
