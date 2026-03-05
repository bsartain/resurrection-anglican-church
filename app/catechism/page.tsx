import HeroImage from "../components/HeroImage";
import { getPageData } from "../api/keystatic/lib/keystatic";
import { DocumentRenderer } from "@keystatic/core/renderer";
import RevealSection from "../components/RevealSection";
import { buildMetadata } from "../lib/buildMetadata";
import CatechismComponent from "../components/CatechismComponent";

export default async function Catechism() {
  const pageData = await getPageData("catechism");
  const pageContent = await pageData?.content();

  return (
    <div>
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>
      <div>
        <RevealSection id="kidsContent" image="/images/pages/jesus-cross.jpg" opacity={0.015}>
          <div className="pt-5 pb-5 reveal">
            <DocumentRenderer document={pageContent ?? []} />
            <CatechismComponent />
          </div>
        </RevealSection>
      </div>
    </div>
  );
}

export async function generateMetadata() {
  const pageData = await getPageData("catechism");

  return buildMetadata({
    title: pageData?.title,
    excerpt: pageData?.excerpt,
    image: pageData?.image,
    path: "/gospel",
  });
}
