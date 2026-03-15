import HeroImage from "../../components/HeroImage";
import { getPageData } from "../../api/keystatic/lib/keystatic";
import { Container } from "react-bootstrap";
import { DocumentRenderer } from "@keystatic/core/renderer";
import RevealSection from "../../components/RevealSection";
import { buildMetadata } from "@/app/lib/buildMetadata";
import { PageModel, Content } from "../../models/pageModel";

const LeftImage: React.FC<{ sectionContent: Content }> = async ({ sectionContent }) => {
  const content = await sectionContent.content();
  return (
    <RevealSection id="anglicanLeftImage" className="home-section anglican-left-section" image="/images/pages/jesus-cross.jpg" opacity={0.03}>
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
    <RevealSection id="anglicanRightImage" image="/images/pages/jesus-cross.jpg" opacity={0.013}>
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

export default async function Anglican() {
  const pageData = (await getPageData("anglican")) as PageModel | null;
  const pageContent = await pageData?.content();

  return (
    <div className="anglican-container">
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>

      <div>
        <RevealSection id="anglicanContent" image="/images/pages/jesus-cross.jpg" opacity={0.01}>
          <Container className="mt-5 mb-5 reveal">
            <DocumentRenderer document={pageContent ?? []} />
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
  const pageData = (await getPageData("anglican")) as PageModel | null;

  return buildMetadata({
    title: pageData?.title,
    excerpt: pageData?.excerpt,
    image: pageData?.image,
    path: "/anglican",
  });
}
