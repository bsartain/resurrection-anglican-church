"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import React from "react";
import DonateButtonModal from "./DonateButtonModal";
import path from "path";

interface HeroImageProps {
  image: string;
  children?: React.ReactNode;
  author?: string;
}

const HeroImage = ({ image, children, author }: HeroImageProps) => {
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
          <hr className="mt-5 mb-1" style={{ width: "50px" }} />
        </div>
        <h1>{children}</h1>
        {pathname === "/give" ? <DonateButtonModal donateButtonText="Donate" /> : null}
        {pathname === "/catechism" ? (
          <div>
            <div className="d-flex justify-content-center w-100">
              <hr className="mt-3 mb-5" style={{ width: "50px" }} />
            </div>
            Anglican Formularies
          </div>
        ) : null}
        {pathname.startsWith("/blog/") && author ? (
          <div>
            <div className="d-flex justify-content-center w-100">
              <hr className="mt-3 mb-5" style={{ width: "50px" }} />
            </div>
            by {author}
          </div>
        ) : null}
        {pathname === "/sermons" ? (
          <div>
            <div className="d-flex justify-content-center w-100">
              <hr className="mt-3 mb-5" style={{ width: "50px" }} />
            </div>
            Latest Sermon
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HeroImage;
