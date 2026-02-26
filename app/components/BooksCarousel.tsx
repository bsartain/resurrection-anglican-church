"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface BookModel {
  image: string | null;
  caption: string;
  subCaption: string;
  category: string;
  link: string;
}

const BookCarousel: React.FC<{ bookTitles: BookModel[] | null }> = ({ bookTitles }) => {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 3.4, spacing: 15 },
    breakpoints: {
      "(max-width: 768px)": {
        slides: { perView: 1.3, spacing: 15 },
      },
    },
  });

  return (
    <>
      <div ref={sliderRef} className="book keen-slider">
        {bookTitles
          ? bookTitles.map((item, index) => (
              <div key={index} className="book keen-slider__slide">
                <div style={{ backgroundImage: `url(${item.image})` }} className="book-image" onClick={() => window.open(item.link, "_blank")} />
                <div className="book-caption" onClick={() => window.open(item.link, "_blank")}>
                  <em>{item.caption}</em>
                  <br />- {item.subCaption}
                </div>
              </div>
            ))
          : null}
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <i className="bi bi-chevron-left" onClick={() => instanceRef.current?.prev()}></i>
        <i className="bi bi-chevron-right" onClick={() => instanceRef.current?.next()}></i>
      </div>
    </>
  );
};

export default BookCarousel;
