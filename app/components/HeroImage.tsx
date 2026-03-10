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

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (hero) {
        hero.style.backgroundPosition = `center ${scrollY * 0.5}px`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
        {pathname === "/give" ? <DonateButtonModal donateButtonText="Donate" /> : null}
        {pathname === "/catechism" ? (
          <div>
            <div className="d-flex justify-content-center w-100">
              <hr className="w-25 mt-4 mb-5" />
            </div>
            Anglican Formularies
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HeroImage;
