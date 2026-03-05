"use client";
import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1618) {
        setButtonVisible(true);
      } else {
        setButtonVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <i
      className="bi bi-arrow-up-circle-fill catechism-scroll-top"
      style={{
        position: "fixed",
        top: "50%",
        right: "1.5rem",
        transform: "translateY(-50%)",
        zIndex: 999,
        cursor: "pointer",
        fontSize: "35px",
        color: "rgb(79 78 78)",
        opacity: buttonVisible ? 1 : 0,
        pointerEvents: buttonVisible ? "auto" : "none",
        transition: "opacity 0.3s ease",
      }}
      onClick={() => window.scrollTo({ top: 1618, behavior: "smooth" })}
      title="Back to the top"
    />
  );
}
