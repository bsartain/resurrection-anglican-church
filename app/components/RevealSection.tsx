"use client";
import React from "react";
import { useInView } from "react-intersection-observer";
import { Container } from "react-bootstrap";

// This component is a wrapper that supports the animation of the section on each page

export default function RevealSection({
  id,
  className,
  children,
  image,
  opacity,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
  image?: string;
  opacity?: number;
}) {
  const { ref, inView } = useInView({ threshold: 0, triggerOnce: true });
  return (
    <section id={id} className={className} ref={ref} style={{ position: "relative" }}>
      {/* Background with opacity */}
      <div
        style={
          image
            ? {
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "top",
                opacity: opacity ? opacity : 0.1,
                zIndex: 0,
              }
            : {}
        }
      />

      {/* Content sits above */}
      <Container className={inView ? "reveal" : ""} style={{ position: "relative", zIndex: 1 }}>
        {children}
      </Container>
    </section>
  );
}
