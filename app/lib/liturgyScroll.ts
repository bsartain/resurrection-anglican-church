// Shared section-jump behaviour for the liturgy reader. Used by both the bottom
// drawer (tap a section) and LiturgyReader (restore position / follow a #hash),
// so the reduced-motion and focus handling can't drift between them.

export const SECTION_ATTRIBUTE = "data-liturgy-section";
export const HEADING_ATTRIBUTE = "data-liturgy-heading";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Scrolls a section into view and moves focus to its heading.
 *
 * Focus matters as much as the scroll: without it a keyboard or screen-reader
 * user stays where they were while the page moves underneath them. The heading
 * carries tabIndex={-1} so it can receive focus without entering the tab order.
 */
// How far off the intended resting place we tolerate before nudging. Small enough
// that the section still lands inside the active-section band, large enough not to
// fight sub-pixel rounding.
const ALIGNMENT_TOLERANCE_PX = 8;

// How long scrolling must be still before we treat the animation as finished.
const QUIET_PERIOD_MS = 150;

// Re-seats a section under the fixed header. Needed because the initial scroll can
// land short: closing the table-of-canvas drawer and late-settling images both shift
// layout mid-animation, and an under-shoot leaves the *previous* section occupying
// the observer band — so the drawer highlights the wrong part and Next appears dead.
function alignSection(section: HTMLElement) {
  const offset = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
  const delta = section.getBoundingClientRect().top - offset;

  if (Math.abs(delta) > ALIGNMENT_TOLERANCE_PX) {
    window.scrollBy({ top: delta, behavior: "auto" });
  }
}

export function jumpToSection(slug: string, { instant = false, updateHash = false }: { instant?: boolean; updateHash?: boolean } = {}): boolean {
  const section = document.getElementById(slug);
  if (!section) return false;

  const immediate = instant || prefersReducedMotion();

  section.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });

  const heading = section.querySelector<HTMLElement>(`[${HEADING_ATTRIBUTE}]`) ?? section;
  heading.focus({ preventScroll: true });

  // Keeps the address bar on the section you're actually reading, so "send me
  // the confession" is a copy-paste. replaceState so this doesn't pile up
  // history entries as someone taps through the service.
  if (updateHash) {
    history.replaceState(null, "", `#${slug}`);
  }

  if (immediate) {
    requestAnimationFrame(() => alignSection(section));
    return true;
  }

  // Correct only once the smooth scroll has actually finished — a nudge mid-flight
  // fights the animation. `scrollend` is the clean signal but isn't in every
  // browser yet (Safari only from 17), so a quiet-period poll backs it up:
  // whichever notices first wins, and the other is torn down.
  let lastScrollAt = performance.now();
  const noteScroll = () => {
    lastScrollAt = performance.now();
  };

  let done = false;
  let poll = 0;

  const settle = () => {
    if (done) return;
    done = true;
    window.clearInterval(poll);
    window.removeEventListener("scroll", noteScroll);
    window.removeEventListener("scrollend", settle);
    alignSection(section);
  };

  window.addEventListener("scroll", noteScroll, { passive: true });
  window.addEventListener("scrollend", settle, { once: true });

  poll = window.setInterval(() => {
    if (performance.now() - lastScrollAt > QUIET_PERIOD_MS) settle();
  }, 100);

  // Hard stop so a page that never goes quiet (a parallax listener, a user still
  // dragging) can't leave the interval running.
  window.setTimeout(settle, 3000);

  return true;
}