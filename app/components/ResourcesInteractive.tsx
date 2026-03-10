"use client";
import { useState } from "react";
import { Container } from "react-bootstrap";
import BookCarousel, { BookModel } from "./BooksCarousel";
import CatechismComponent from "./CatechismComponent";
import RevealSection from "./RevealSection";

export default function ResourcesInteractive({ anglicanTitles }: { anglicanTitles: BookModel[] }) {
  const [activeTab, setActiveTab] = useState("catechism");

  const handleBookClick = (item: BookModel) => {
    window.open(item.link, "_blank");
  };

  return (
    <>
      <RevealSection id="resourceContentBooks" image="/images/pages/jesus-cross.jpg" opacity={0.02}>
        <h2 className="text-center">Anglican Spiritual Formation</h2>
        <Container className="mt-5 mb-5 reveal book-container">
          <BookCarousel bookTitles={anglicanTitles} onBookClick={handleBookClick} />
        </Container>
      </RevealSection>
    </>
  );
}
