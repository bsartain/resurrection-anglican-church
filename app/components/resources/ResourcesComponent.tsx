import { Container } from "react-bootstrap";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { DocumentElement } from "@keystatic/core";
import RevealSection from "../RevealSection";
import BookCarousel from "../BooksCarousel";

interface ResourcesModel {
  title: string;
  image: string | null;
  content: () => Promise<DocumentElement[]>;
  subsections: readonly {
    readonly title: string;
    readonly content: () => Promise<DocumentElement[]>;
    readonly image: string | null;
    readonly imageDirection: "right" | "left";
  }[];
  multipleImages: {
    discriminant?: boolean | null;
    value: readonly Value[] | null;
  };
}

interface Value {
  image: string | null;
  caption: string;
  subCaption: string;
  category: string;
  link: string;
}

interface Content {
  image: string | null;
  imageDirection: string;
  title: string;
  content: () => Promise<DocumentElement[]>;
}

const ResourcesComponent: React.FC<{ pageData: ResourcesModel | null | undefined; pageContent: DocumentElement[] | undefined }> = ({
  pageData,
  pageContent,
}) => {
  const bookTitles = pageData?.multipleImages?.value ? pageData?.multipleImages?.value.filter((item: Value) => item.category === "book") : [];
  const anglicanTitles = pageData?.multipleImages?.value ? pageData?.multipleImages?.value.filter((item: Value) => item.category === "anglican") : [];

  return (
    <div className="pb-5">
      <RevealSection id="resourceContent" image="/images/pages/jesus-cross.jpg" opacity={0.02}>
        <Container className="pt-5 reveal text-center">
          <DocumentRenderer document={pageContent ?? []} />
          <div className="book-container">
            <BookCarousel bookTitles={bookTitles} />
          </div>
        </Container>
      </RevealSection>
      <RevealSection id="resourceContentBooks" image="/images/pages/jesus-cross.jpg" opacity={0.02}>
        <h2 className="text-center">Anglican Spiritual Formation</h2>
        <Container className="mt-5 mb-5 reveal book-container">
          <BookCarousel bookTitles={anglicanTitles} />
        </Container>
      </RevealSection>
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

export default ResourcesComponent;

const LeftImage: React.FC<{ sectionContent: Content }> = async ({ sectionContent }) => {
  const content = await sectionContent.content();
  return (
    <RevealSection
      id="anglicanLeftImage"
      className="home-section anglican-left-section"
      image="/images/pages/eucharist-illustration.jpg"
      opacity={0.01}
    >
      <Container className="reveal">
        <div className="story-container">
          {sectionContent.image ? (
            <div className="story-image rounded mb-3" style={{ backgroundImage: `url("${sectionContent.image}")`, backgroundSize: "contain" }}></div>
          ) : null}
          <div>
            <h2>{sectionContent.title}</h2>
            <DocumentRenderer document={content} />
          </div>
        </div>
      </Container>
    </RevealSection>
  );
};

const RightImage: React.FC<{ sectionContent: Content }> = async ({ sectionContent }) => {
  const content = await sectionContent.content();
  return (
    <RevealSection id="anglicanRightImage" image="/images/pages/jesus-cross.jpg" opacity={0.02}>
      <section id="story" className="home-section">
        <Container className="reveal">
          <div className="story-container">
            <div>
              <h2>{sectionContent.title}</h2>
              <DocumentRenderer document={content} />
            </div>
            {sectionContent.image ? (
              <div className="story-image rounded" style={{ backgroundImage: `url("${sectionContent.image}")`, backgroundSize: "contain" }}></div>
            ) : null}
          </div>
        </Container>
      </section>
    </RevealSection>
  );
};
