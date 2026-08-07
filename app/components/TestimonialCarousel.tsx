"use client";
import { useState } from "react";
import { useKeenSlider, type KeenSliderInstance, type KeenSliderPlugin } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface Testimonial {
  name: string;
  testimonial: string;
}

const AUTOPLAY_INTERVAL_MS = 7000;

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

/**
 * Advances the slider on a timer, pausing whenever the visitor is engaged with
 * it — hover, touch, keyboard focus, or the tab being in the background. Six
 * testimonials at seven seconds each is a long read; nobody should lose their
 * place mid-sentence because a timer fired.
 */
function autoplay(): KeenSliderPlugin {
  return (slider: KeenSliderInstance) => {
    let timer: ReturnType<typeof setTimeout>;
    let paused = false;

    const clear = () => clearTimeout(timer);

    const schedule = () => {
      clear();
      // Checked at schedule time so a mid-visit change to the OS motion
      // setting takes effect on the next tick.
      if (paused || prefersReducedMotion() || slider.track.details.slides.length < 2) return;
      timer = setTimeout(() => slider.next(), AUTOPLAY_INTERVAL_MS);
    };

    const pause = () => {
      paused = true;
      clear();
    };

    const resume = () => {
      paused = false;
      schedule();
    };

    slider.on("created", () => {
      const node = slider.container;
      node.addEventListener("mouseover", pause);
      node.addEventListener("mouseout", resume);
      node.addEventListener("focusin", pause);
      node.addEventListener("focusout", resume);
      // A carousel spinning in a hidden tab just wastes the visitor's battery.
      document.addEventListener("visibilitychange", () => (document.hidden ? pause() : resume()));
      schedule();
    });

    slider.on("dragStarted", pause);
    slider.on("animationEnded", schedule);
    slider.on("updated", schedule);
    slider.on("destroyed", clear);
  };
}

const TestimonialCarousel: React.FC<{ testimonials: readonly Testimonial[] }> = ({ testimonials }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Mirrored into state rather than read off the slider instance during
  // render — the instance ref is not a render-time value.
  const [dotCount, setDotCount] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: testimonials.length > 2,
      slides: { perView: 2, spacing: 24 },
      breakpoints: {
        "(max-width: 768px)": {
          slides: { perView: 1, spacing: 12 },
        },
      },
      created: (slider) => setDotCount(slider.track.details.slides.length),
      // perView changes at the breakpoint, which changes how many dots there are.
      updated: (slider) => setDotCount(slider.track.details.slides.length),
      slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
    },
    [autoplay()]
  );

  return (
    <section className="relative testimonial-slider-container" aria-roledescription="carousel" aria-label="Voices of Resurrection">
      <h2 className="mb-5 w-100 text-center">Voices of Resurrection</h2>

      <div ref={sliderRef} className="keen-slider">
        {testimonials.map((testimonial, index) => (
          <figure
            key={testimonial.name}
            className="keen-slider__slide testimonial-slide"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${testimonials.length}`}
          >
            <i className="bi bi-quote testimonial-quote-mark" aria-hidden="true" />
            <blockquote className="testimonial-body">{testimonial.testimonial}</blockquote>
            <figcaption className="testimonial-name">{testimonial.name}</figcaption>
          </figure>
        ))}
      </div>

      <div className="navigation-buttons">
        <button type="button" className="testimonial-nav-button" onClick={() => instanceRef.current?.prev()} aria-label="Previous testimonial">
          <i className="bi bi-chevron-left" aria-hidden="true" />
        </button>

        {dotCount > 0 ? (
          <div className="testimonial-dots">
            {Array.from({ length: dotCount }, (_, index) => (
              <button
                key={testimonials[index]?.name ?? index}
                type="button"
                className={index === currentSlide ? "testimonial-dot is-active" : "testimonial-dot"}
                onClick={() => instanceRef.current?.moveToIdx(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={index === currentSlide}
              />
            ))}
          </div>
        ) : null}

        <button type="button" className="testimonial-nav-button" onClick={() => instanceRef.current?.next()} aria-label="Next testimonial">
          <i className="bi bi-chevron-right" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
