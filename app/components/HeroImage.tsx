"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import React from "react";
import DonateButtonModal from "./DonateButtonModal";

interface HeroImageProps {
  image: string;
  children?: React.ReactNode;
}

const HeroImage = ({ image, children }: HeroImageProps) => {
  const pathname = usePathname();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // While scrolling - move with scroll at reduced speed
      if (hero) {
        hero.style.transition = "none";
        hero.style.backgroundPosition = `center ${scrollY * 0.3}px`;
      }

      // When scrolling stops - animate up a little
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (hero) {
          hero.style.transition = "background-position 0.8s ease-out";
          hero.style.backgroundPosition = `center ${scrollY * 0.3 - 20}px`;
        }
      }, 50); // fires 50ms after scroll stops
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
  return (
    <div className="hero-image-container" style={{ backgroundImage: `url(${image})` }} ref={heroRef}>
      <div className="overlay"></div>
      <div className="hero-image-text reveal">
        <span>Resurrection Anglican Church</span>
        <div className="d-flex justify-content-center w-100">
          <hr className="w-25 mt-5 mb-1" />
        </div>
        <h1>{children}</h1>
        {pathname === "/give" ? <DonateButtonModal donateButtonText="DONATE" /> : null}
        {pathname === "/catechism" ? (
          <div>
            <div className="d-flex justify-content-center w-100">
              <hr className="w-25 mt-4 mb-5" />
            </div>
            An Anglican Catechism
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HeroImage;
