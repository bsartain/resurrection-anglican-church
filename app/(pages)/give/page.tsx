import HeroImage from "../../components/HeroImage";
import { getPageData } from "../../api/keystatic/lib/keystatic";
import { Container } from "react-bootstrap";
import { DocumentRenderer } from "@keystatic/core/renderer";
import RevealSection from "../../components/RevealSection";
import DonateButtonModal from "../../components/DonateButtonModal";
import { buildMetadata } from "../../lib/buildMetadata";
import { PageModel, Content } from "../../models/pageModel";

const LeftImage: React.FC<{ sectionContent: Content }> = async ({ sectionContent }) => {
  const content = await sectionContent.content();
  return (
    <section id="giveImageLeft" className="home-section">
      <RevealSection id="kidsLeftImage">
        <Container className="reveal">
          <div className="story-container">
            {sectionContent.image ? <div className="story-image rounded" style={{ backgroundImage: `url("${sectionContent.image}")` }} /> : null}
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
    <RevealSection id="kidsRightImage">
      <section id="giveImageRight" className="home-section">
        <Container className="reveal">
          <div className="story-container">
            <div>
              <h2>{sectionContent.title}</h2>
              <DocumentRenderer document={content} />
            </div>
            {sectionContent.image ? <div className="story-image rounded" style={{ backgroundImage: `url("${sectionContent.image}")` }} /> : null}
          </div>
        </Container>
      </section>
    </RevealSection>
  );
};

export default async function Give() {
  const pageData = (await getPageData("give")) as PageModel | null;
  const pageContent = await pageData?.content();

  return (
    <div className="give-container dark-container">
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>
      <DonateButtonModal donateButtonText="Join The Mission" />
      <div>
        <RevealSection id="kidsContent" image="/images/pages/jesus-cross.jpg" opacity={0.02}>
          <Container className="mt-5 mb-5 reveal">
            <DocumentRenderer document={pageContent ?? []} />
          </Container>
        </RevealSection>

        <RevealSection id="kidsLeftImage" image="/images/pages/jesus-cross.jpg" opacity={0.01}>
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
        </RevealSection>
      </div>
    </div>
  );
}

export async function generateMetadata() {
  const pageData = (await getPageData("give")) as PageModel | null;

  return buildMetadata({
    title: pageData?.title,
    excerpt: pageData?.excerpt,
    image: pageData?.image,
    path: "/give",
  });
}
