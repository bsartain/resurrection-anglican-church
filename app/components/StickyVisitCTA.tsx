"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  readonly href?: string;
  readonly label?: string;
  /** Pixels scrolled before the pill appears — roughly past the hero. */
  readonly revealAfter?: number;
}

/**
 * Keeps the page's primary action reachable all the way down, with a hairline
 * read-progress bar along the bottom edge.
 *
 * Both sit at the bottom of the viewport on purpose: the nav is fixed to the
 * top and hides on scroll-down, and the back-to-top control owns the
 * bottom-right corner.
 */
export default function StickyVisitCTA({ href = "/plan-your-visit", label = "Plan Your Visit", revealAfter = 700 }: Readonly<Props>) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrolled = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;

      setProgress(scrollable > 0 ? Math.min(100, (scrolled / scrollable) * 100) : 0);
      setVisible(scrolled > revealAfter);
    };

    // Scroll fires far more often than the screen repaints; coalesce to one
    // measurement per frame so the bar never causes jank on a long page.
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [revealAfter]);

  return (
    <>
      <div className="reading-progress" role="presentation">
        <div className="reading-progress-bar" style={{ transform: `scaleX(${progress / 100})` }} />
      </div>

      <Link href={href} className={visible ? "sticky-visit-cta is-visible" : "sticky-visit-cta"} aria-hidden={!visible} tabIndex={visible ? 0 : -1}>
        <i className="bi bi-calendar-heart me-2" aria-hidden="true" />
        {label}
      </Link>
    </>
  );
}
