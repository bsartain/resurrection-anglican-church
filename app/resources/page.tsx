import HeroImage from "../components/HeroImage";
import { getPageData } from "../api/keystatic/lib/keystatic";
import { Container } from "react-bootstrap";
import { DocumentRenderer } from "@keystatic/core/renderer";
import RevealSection from "../components/RevealSection";
import BookCarousel from "../components/BooksCarousel";
import { buildMetadata } from "../lib/buildMetadata";
import { PageModel, Content, Value } from "../models/pageModel";

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
            <div className="story-image rounded mb-3" style={{ backgroundImage: `url("${sectionContent.image}")`, backgroundSize: "contain" }} />
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
              <div className="story-image rounded" style={{ backgroundImage: `url("${sectionContent.image}")`, backgroundSize: "contain" }} />
            ) : null}
          </div>
        </Container>
      </section>
    </RevealSection>
  );
};

export default async function Resources() {
  const pageData = (await getPageData("resources")) as PageModel | null;
  const pageContent = await pageData?.content();

  const bookTitles = pageData?.multipleImages?.value ? pageData.multipleImages.value.filter((item: Value) => item.category === "book") : [];
  const anglicanTitles = pageData?.multipleImages?.value ? pageData.multipleImages.value.filter((item: Value) => item.category === "anglican") : [];

  return (
    <div className="resource-container dark-container">
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>

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

        {pageData?.subsections && pageData.subsections.length > 0
          ? pageData.subsections.map((item: Content, index: number) => {
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
    </div>
  );
}

export async function generateMetadata() {
  const pageData = (await getPageData("resources")) as PageModel | null;

  return buildMetadata({
    title: pageData?.title,
    excerpt: pageData?.excerpt,
    image: pageData?.image,
    path: "/resources",
  });
}
