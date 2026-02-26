"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface Testimonial {
  name: string;
  testimonial: string;
}

const TestimonialCarousel: React.FC<{ testimonials: readonly Testimonial[] }> = ({ testimonials }) => {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 2 },
  });

  return (
    <div className="relative testimonial-slider-container">
      <h2 className="mb-5 w-100 text-center">Voices of Resurrection</h2>
      <div ref={sliderRef} className="keen-slider">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="keen-slider__slide p-6" style={{ padding: "20px" }}>
            <div className="font-semibold mb-2">{testimonial.name}</div>
            <div className="text-gray-600">{testimonial.testimonial}</div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <i className="bi bi-chevron-left" onClick={() => instanceRef.current?.prev()}></i>
        <i className="bi bi-chevron-right" onClick={() => instanceRef.current?.next()}></i>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
