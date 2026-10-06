"use client";
import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface Testimonial {
  name: string;
  testimonial: string;
}

const TestimonialCarousel: React.FC<{ testimonials: readonly Testimonial[] }> = ({ testimonials }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Mirrored into state rather than read off the slider instance during
  // render — the instance ref is not a render-time value.
  const [dotCount, setDotCount] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: testimonials.length > 2,
    slides: { perView: 2, spacing: 24 },
    breakpoints: {
      "(max-width: 768px)": {
        slides: { perView: 1, spacing: 12 },
      },
    },
    created: (slider) => setDotCount(slider.track.details.slides.length),
    updated: (slider) => setDotCount(slider.track.details.slides.length),
    slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
  });

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
            <figcaption className="testimonial-name">- {testimonial.name}</figcaption>
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
