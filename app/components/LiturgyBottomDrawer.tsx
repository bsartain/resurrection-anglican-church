"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Offcanvas from "react-bootstrap/Offcanvas";
import { usePrimaryLiturgyDrawer } from "../context/LiturgyDrawerContext";
import { jumpToSection } from "../lib/liturgyScroll";

const TOC_ID = "liturgyTableOfContents";

// Reading sizes, not a continuous zoom — three taps covers everyone from
// "I have my glasses" to "I do not". Index 1 is the unscaled default.
const FONT_SCALES = [0.9, 1, 1.15, 1.3, 1.6];
const DEFAULT_SCALE_INDEX = 1;
const FONT_SCALE_STORAGE_KEY = "liturgy:fontScale";

// Read at first render rather than in an effect: the controls live inside a
// closed Offcanvas, which react-bootstrap doesn't mount until it's opened, so
// there's no server-rendered markup here for this to disagree with.
function readSavedScaleIndex() {
  if (typeof window === "undefined") return DEFAULT_SCALE_INDEX;

  try {
    // Test for the key before converting: Number(null) is 0, which would pass a
    // bare range check and silently hand every first-time reader the smallest size.
    const stored = localStorage.getItem(FONT_SCALE_STORAGE_KEY);
    if (stored === null) return DEFAULT_SCALE_INDEX;

    const saved = Number(stored);
    if (Number.isInteger(saved) && saved >= 0 && saved < FONT_SCALES.length) return saved;
  } catch {
    // Storage can be unavailable in private browsing; the default is fine.
  }

  return DEFAULT_SCALE_INDEX;
}

function LiturgyBottomDrawer() {
  const [show, setShow] = useState(false);
  const [scaleIndex, setScaleIndex] = useState(readSavedScaleIndex);
  const pathname = usePathname();
  const { drawerContent, activeSlug } = usePrimaryLiturgyDrawer();

  const handleClose = useCallback(() => setShow(false), []);

  const activeIndex = activeSlug ? drawerContent.findIndex((item) => item.slug === activeSlug) : -1;
  const hasSections = drawerContent.length > 0;
  // -1 means "above the first section" (still in the hero), so Next starts at 0.
  const progress = activeIndex < 0 ? 0 : ((activeIndex + 1) / drawerContent.length) * 100;

  // Deferred until the Offcanvas has fully closed. react-bootstrap returns focus
  // to whatever opened the drawer as part of hiding it, which would otherwise
  // undo the focus move onto the section heading and leave AT users behind.
  const pendingJump = useRef<string | null>(null);
  const pendingPrint = useRef(false);

  const handleJump = useCallback(
    (slug: string) => {
      pendingJump.current = slug;
      handleClose();
    },
    [handleClose]
  );

  // Printing goes through the page's own @media print rules rather than cloning the
  // liturgy into an offscreen iframe, so the printed sheet inherits the real DOM and
  // every print rule already written for it. Deferred like a jump, because Bootstrap
  // locks body scrolling while the drawer is open and that skews pagination.
  const handlePrint = useCallback(() => {
    pendingPrint.current = true;
    handleClose();
  }, [handleClose]);

  const handleExited = useCallback(() => {
    const slug = pendingJump.current;
    pendingJump.current = null;
    if (slug) {
      requestAnimationFrame(() => jumpToSection(slug, { updateHash: true }));
      return;
    }

    if (pendingPrint.current) {
      pendingPrint.current = false;
      requestAnimationFrame(() => window.print());
    }
  }, []);

  const step = useCallback(
    (direction: -1 | 1) => {
      const next = Math.min(Math.max(activeIndex + direction, 0), drawerContent.length - 1);
      const target = drawerContent[next];
      if (target) jumpToSection(target.slug, { updateHash: true });
    },
    [activeIndex, drawerContent]
  );

  // Drives every font-size on the liturgy page through one custom property.
  useEffect(() => {
    document.documentElement.style.setProperty("--liturgy-font-scale", String(FONT_SCALES[scaleIndex]));
    try {
      localStorage.setItem(FONT_SCALE_STORAGE_KEY, String(scaleIndex));
    } catch {
      // Non-fatal.
    }
  }, [scaleIndex]);

  // A long service outruns the drawer's height, so open onto where you actually
  // are rather than back at the Opening Acclamation. Runs on `onEntered` rather
  // than in an effect keyed on `show`, because the panel is still transitioning
  // in when the state flips and has no scroll height to work with yet.
  const handleEntered = useCallback(() => {
    if (!activeSlug) return;
    document.querySelector(`[data-toc-slug="${activeSlug}"]`)?.scrollIntoView({ block: "center" });
  }, [activeSlug]);

  // No outline means either another route or a liturgy page that failed to load
  // (the error boundary renders without a reader) — a toolbar of dead buttons
  // would be worse than no toolbar.
  if (pathname !== "/liturgy" || !hasSections) return null;

  return (
    <div className="liturgy-bottom-drawer-container">
      <div className="liturgy-progress">
        <div className="liturgy-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="liturgy-toolbar">
        <button type="button" className="liturgy-toolbar-btn" onClick={() => step(-1)} disabled={activeIndex <= 0} aria-label="Previous section">
          <i className="bi bi-chevron-left" aria-hidden="true" />
          <span>Prev</span>
        </button>

        <button
          type="button"
          className="liturgy-toolbar-btn liturgy-toolbar-contents"
          onClick={() => setShow((open) => !open)}
          aria-expanded={show}
          aria-controls={TOC_ID}
        >
          <i className="bi bi-chevron-compact-up" aria-hidden="true" />
          <span>Contents</span>
        </button>

        <button
          type="button"
          className="liturgy-toolbar-btn"
          onClick={() => step(1)}
          disabled={activeIndex >= drawerContent.length - 1}
          aria-label="Next section"
        >
          <span>Next</span>
          <i className="bi bi-chevron-right" aria-hidden="true" />
        </button>
      </div>

      <Offcanvas
        show={show}
        onHide={handleClose}
        onEntered={handleEntered}
        onExited={handleExited}
        placement="bottom"
        className="liturgy-toc-offcanvas"
        id={TOC_ID}
      >
        <Offcanvas.Header closeButton>
          <div className="liturgy-toc-header">
            <Offcanvas.Title as="div">Choose a section below to follow the service.</Offcanvas.Title>
            <div className="liturgy-toc-tools">
              <fieldset className="liturgy-text-size">
                <legend className="visually-hidden">Text size</legend>
                <button
                  type="button"
                  className="liturgy-text-size-btn"
                  onClick={() => setScaleIndex((index) => Math.max(index - 1, 0))}
                  disabled={scaleIndex === 0}
                  aria-label="Decrease text size"
                >
                  A<span aria-hidden="true">&minus;</span>
                </button>
                <button
                  type="button"
                  className="liturgy-text-size-btn"
                  onClick={() => setScaleIndex((index) => Math.min(index + 1, FONT_SCALES.length - 1))}
                  disabled={scaleIndex === FONT_SCALES.length - 1}
                  aria-label="Increase text size"
                >
                  A<span aria-hidden="true">+</span>
                </button>
              </fieldset>
              {/* Outside the text-size fieldset: inside it, screen readers announce this
                  as one of the sizing controls. */}
              <button type="button" className="liturgy-print-btn" onClick={handlePrint} aria-label="Print the order of service">
                <i className="bi bi-printer" aria-hidden="true" />
              </button>
            </div>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ol className="liturgy-toc">
            {drawerContent.map((item) => (
              <li key={item.slug}>
                <button
                  type="button"
                  className="liturgy-toc-link"
                  data-toc-slug={item.slug}
                  aria-current={item.slug === activeSlug ? "true" : undefined}
                  onClick={() => handleJump(item.slug)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ol>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default LiturgyBottomDrawer;
