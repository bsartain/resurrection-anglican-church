"use client";
import { useInView } from "react-intersection-observer";
import { Container } from "react-bootstrap";
import { usePrimaryColor } from "@/app/context/PrimaryColorContext";

export default function RevealSection({
  id,
  className,
  children,
  image,
  opacity,
}: Readonly<{
  id: string;
  className?: string;
  children: React.ReactNode;
  image?: string;
  opacity?: number;
}>) {
  const { ref, inView } = useInView({ threshold: 0, triggerOnce: true });
  const primaryColor = usePrimaryColor();
  console.log("🚀 ~ RevealSection ~ primaryColor:", primaryColor);
  return (
    <section
      id={id}
      className={className}
      ref={ref}
      style={
        className?.includes("dark-background-home-section")
          ? { position: "relative", background: primaryColor, color: primaryColor === "#f5f1e8" ? "#212529" : "#ffffff" }
          : { position: "relative" }
      }
    >
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
