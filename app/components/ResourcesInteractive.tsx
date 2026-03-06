"use client";
import { useState } from "react";
import { Container } from "react-bootstrap";
import BookCarousel, { BookModel } from "./BooksCarousel";
import CatechismComponent from "./CatechismComponent";
import RevealSection from "./RevealSection";

export default function ResourcesInteractive({ anglicanTitles }: { anglicanTitles: BookModel[] }) {
  const [activeTab, setActiveTab] = useState("catechism");

  const handleBookClick = (item: BookModel) => {
    if (item.link.includes("BCP2019.pdf")) {
      setActiveTab("bcp");
      document.getElementById("anglicanSpiritualFormation")?.scrollIntoView({ behavior: "smooth" });
    } else if (item.link.includes("To-Be-a-Christian.pdf")) {
      setActiveTab("catechism");
      document.getElementById("anglicanSpiritualFormation")?.scrollIntoView({ behavior: "smooth" });
    } else if (item.link.includes("Thirty-Nine-Articles-of-Religion.pdf")) {
      setActiveTab("thirtyNine");
      document.getElementById("anglicanSpiritualFormation")?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(item.link, "_blank");
    }
  };

  return (
    <>
      <RevealSection id="resourceContentBooks" image="/images/pages/jesus-cross.jpg" opacity={0.02}>
        <h2 className="text-center">Anglican Spiritual Formation</h2>
        <Container className="mt-5 mb-5 reveal book-container">
          <BookCarousel bookTitles={anglicanTitles} onBookClick={handleBookClick} />
        </Container>
      </RevealSection>

      <RevealSection id="anglicanSpiritualFormation" image="/images/pages/jesus-cross.jpg" opacity={0.02}>
        <Container className="mt-5 mb-5 formularies-resource-container">
          <CatechismComponent activeKey={activeTab} onSelect={(k) => setActiveTab(k ?? "catechism")} />
        </Container>
      </RevealSection>
    </>
  );
}
