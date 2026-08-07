"use client";

import { useEffect, useRef, useState } from "react";

// The shape of an Anglican Sunday, in the order it happens. Kept in the
// component rather than the CMS because the order is the liturgy itself — it
// isn't editorial copy that changes week to week.
const STEPS = [
  {
    title: "We Gather",
    icon: "bi-bell",
    summary: "Acclamation & Collect for Purity",
    detail:
      "We begin by naming why we are here. The celebrant greets us, and together we pray that God would cleanse our hearts before we do anything else.",
  },
  {
    title: "The Word",
    icon: "bi-book",
    summary: "Scripture read aloud & the sermon",
    detail:
      "Four readings — Old Testament, a psalm, an epistle, and the Gospel — are read aloud, then preached. Over the course of a year the lectionary walks us through the whole sweep of Scripture, not just the passages we would have chosen.",
  },
  {
    title: "We Respond",
    icon: "bi-chat-quote",
    summary: "The Creed, the Prayers, and Confession",
    detail:
      "We say the Nicene Creed together with the Church across the centuries, pray for the world and for one another, and then confess our sins and hear God's forgiveness declared over us.",
  },
  {
    title: "The Peace",
    icon: "bi-people",
    summary: "We greet one another",
    detail:
      'Having been forgiven, we turn to each other. "The peace of the Lord be always with you." This is a handshake, a hug, or a nod — however you\'re comfortable.',
  },
  {
    title: "Holy Communion",
    icon: "bi-cup",
    summary: "We come to the Lord's Table",
    detail:
      "The bread and wine are blessed and we come forward to receive. Communion is open to all who trust in Jesus Christ. If you'd rather receive a blessing instead, simply cross your arms over your chest.",
  },
  {
    title: "The Sending",
    icon: "bi-door-open",
    summary: "We are sent out",
    detail:
      'We are blessed and sent: "Go in peace to love and serve the Lord." Formed by Word and Sacrament, we go back into Rock Hill as God\'s people.',
  },
] as const;

export default function GatheringStepper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const railRef = useRef<HTMLDivElement | null>(null);

  // On a phone the rail only shows three steps at a time, so advancing with
  // the Previous/Next buttons would otherwise move the panel while the icons
  // sat still off-screen. Bring the active step along with it.
  useEffect(() => {
    const rail = railRef.current;
    const step = stepRefs.current[activeIndex];
    if (!rail || !step) return;

    // Nothing to do on desktop, where all six fit.
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    if (maxScroll <= 0) return;

    // Centred by hand rather than with scrollIntoView, which would also scroll
    // the page vertically and yank the panel out from under the reader.
    const centred = step.offsetLeft - (rail.clientWidth - step.offsetWidth) / 2;

    rail.scrollTo({
      left: Math.max(0, Math.min(centred, maxScroll)),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [activeIndex]);

  // Arrow keys move through the liturgy the way it moves — the tablist pattern,
  // so the whole rail is a single tab stop.
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: STEPS.length - 1,
    };

    const target = moves[event.key];
    if (target === undefined) return;

    event.preventDefault();
    const next = (target + STEPS.length) % STEPS.length;
    setActiveIndex(next);
    stepRefs.current[next]?.focus();
  };

  const activeStep = STEPS[activeIndex];

  return (
    <div className="gathering-stepper">
      <div className="gathering-stepper-rail" ref={railRef} role="tablist" aria-label="What happens when we gather, step by step">
        {STEPS.map((step, index) => (
          <button
            key={step.title}
            type="button"
            role="tab"
            ref={(node) => {
              stepRefs.current[index] = node;
            }}
            id={`gathering-step-${index}`}
            aria-selected={index === activeIndex}
            aria-controls="gathering-step-panel"
            tabIndex={index === activeIndex ? 0 : -1}
            className={`gathering-step${index === activeIndex ? " is-active" : ""}${index < activeIndex ? " is-passed" : ""}`}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span className="gathering-step-marker">
              {step.icon === "bi-cup" ? (
                <svg
                  width="100%"
                  viewBox="0 0 400 400"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ maxWidth: "400px", display: "block", marginInline: "auto" }}
                >
                  <title>Chalice and bread outline icon</title>
                  <desc>
                    A white outlined icon with transparent fill showing a communion chalice with a cross in the bowl, beside a loaf of bread.
                  </desc>
                  <g fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="190" cy="70" rx="95" ry="18"></ellipse>
                    <path d="M95,70 C85,135 130,180 190,190 C255,180 300,135 290,70"></path>
                    <line x1="190" y1="190" x2="190" y2="255"></line>
                    <circle cx="190" cy="262" r="13"></circle>
                    <line x1="190" y1="275" x2="190" y2="300"></line>
                    <ellipse cx="190" cy="308" rx="45" ry="9"></ellipse>
                    <ellipse cx="190" cy="326" rx="65" ry="10"></ellipse>
                    <line x1="126" y1="308" x2="126" y2="326"></line>
                    <line x1="254" y1="308" x2="254" y2="326"></line>
                    <line x1="190" y1="98" x2="190" y2="148"></line>
                    <line x1="167" y1="115" x2="213" y2="115"></line>
                    <path d="M225,300 Q210,265 255,252 Q300,235 335,258 Q365,278 350,305 Q335,328 285,330 Q245,328 225,300 Z"></path>
                    <path d="M245,268 Q255,282 250,300"></path>
                    <path d="M280,258 Q292,275 286,296"></path>
                    <path d="M315,262 Q325,278 320,298"></path>
                  </g>
                </svg>
              ) : (
                <i className={`bi ${step.icon}`} aria-hidden="true" />
              )}
            </span>
            <span className="gathering-step-title">{step.title}</span>
          </button>
        ))}
      </div>

      <div className="gathering-stepper-panel" id="gathering-step-panel" role="tabpanel" aria-labelledby={`gathering-step-${activeIndex}`}>
        <p className="gathering-step-count">
          Step {activeIndex + 1} of {STEPS.length}
        </p>
        <h3>{activeStep.title}</h3>
        <p className="gathering-step-summary">{activeStep.summary}</p>
        <p className="gathering-step-detail">{activeStep.detail}</p>

        <div className="gathering-stepper-nav">
          <button
            type="button"
            className="btn gathering-nav-button"
            onClick={() => setActiveIndex((current) => (current - 1 + STEPS.length) % STEPS.length)}
          >
            <i className="bi bi-chevron-left me-2" aria-hidden="true" />
            Previous
          </button>
          <button type="button" className="btn gathering-nav-button" onClick={() => setActiveIndex((current) => (current + 1) % STEPS.length)}>
            Next
            <i className="bi bi-chevron-right ms-2" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
