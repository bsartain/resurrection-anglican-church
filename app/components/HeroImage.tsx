"use client";
import { usePathname } from "next/navigation";
import React from "react";
import DonateButtonModal from "./DonateButtonModal";

interface HeroImageProps {
  image: string;
  children?: React.ReactNode;
}

const HeroImage = ({ image, children }: HeroImageProps) => {
  const pathname = usePathname();
  return (
    <div className="hero-image-container" style={{ backgroundImage: `url(${image})` }}>
      <div className="overlay"></div>
      <div className="hero-image-text reveal">
        <span>Resurrection Anglican Church</span>
        <div className="d-flex justify-content-center w-100">
          <hr className="w-25 mt-5 mb-1" />
        </div>
        <h1>{children}</h1>
        {pathname === "/give" ? <DonateButtonModal donateButtonText="DONATE" /> : null}
      </div>
    </div>
  );
};

export default HeroImage;
