import HeroImage from "../HeroImage";
import { Container } from "react-bootstrap";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { DocumentElement } from "@keystatic/core";
import RevealSection from "../RevealSection";

interface KidsPage {
  title: string;
  image: string | null;
  content: () => Promise<DocumentElement[]>;
  subsections: readonly {
    readonly title: string;
    readonly content: () => Promise<DocumentElement[]>;
    readonly image: string | null;
    readonly imageDirection: "right" | "left";
  }[];
  multipleImages: object;
}

interface Content {
  image: string | null;
  imageDirection: string;
  title: string;
  content: () => Promise<DocumentElement[]>;
}

const KidsComponent: React.FC<{ pageData: KidsPage | null; pageContent: DocumentElement[] | undefined }> = ({ pageData, pageContent }) => {
  return (
    <div>
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>
      <div className="kids-ministry-section pb-5 pt-5">
        <RevealSection id="kidsPageQuote">
          <Container className="reveal">
            <article>
              <h1>Jesus said, &ldquo;Let the little children come to me and do not hinder them, for to such belongs the Kingdom of Heaven.&rdquo;</h1>
              <p>
                ﻿<em>- Matthew 19:14</em>
              </p>
            </article>
          </Container>
        </RevealSection>
      </div>

      <div style={{ backgroundImage: 'url("/images/pages/christmas-childrens-play.jpg")' }} className="kids-ministry-first-image-wide rounded">
        <Container className="pb-5 pt-5 reveal">
          <DocumentRenderer document={pageContent ?? []} />
        </Container>
      </div>

      {pageData?.subsections && pageData?.subsections.length > 0
        ? pageData?.subsections.map((item: Content, index: number) => {
            if (item.imageDirection === "right") {
              return (
                <div key={index}>
                  <RightImage sectionContent={item} />
                </div>
              );
            } else {
              return (
                <div key={index}>
                  <LeftImage sectionContent={item} />
                </div>
              );
            }
          })
        : null}
    </div>
  );
};

export default KidsComponent;

const LeftImage: React.FC<{ sectionContent: Content }> = async ({ sectionContent }) => {
  const content = await sectionContent.content();
  return (
    <section id="story" className="home-section kids-ministry-section">
      <RevealSection id="kidsLeftImage">
        <Container className="reveal">
          <div className="story-container">
            <div className="story-image rounded mb-3" style={{ backgroundImage: `url("${sectionContent.image}")`, backgroundSize: "contain" }}></div>
            <div>
              <h2>{sectionContent.title}</h2>
              <DocumentRenderer document={content} />
            </div>
          </div>
        </Container>
      </RevealSection>
    </section>
  );
};

const RightImage: React.FC<{ sectionContent: Content }> = async ({ sectionContent }) => {
  const content = await sectionContent.content();
  return (
    <section id="story" className="home-section">
      <RevealSection id="kidsRightImage">
        <Container className="reveal">
          <div className="story-container">
            <div>
              <h2>{sectionContent.title}</h2>
              <DocumentRenderer document={content} />
            </div>
            <div className="story-image rounded" style={{ backgroundImage: `url("${sectionContent.image}")` }}></div>
          </div>
        </Container>
      </RevealSection>
    </section>
  );
};
