import HeroImage from "../components/HeroImage";
import { getPageData } from "../api/keystatic/lib/keystatic";
import { DocumentRenderer } from "@keystatic/core/renderer";
import RevealSection from "../components/RevealSection";
import { buildMetadata } from "../lib/buildMetadata";

export default async function Gospel() {
  const pageData = await getPageData("gospel");
  const pageContent = await pageData?.content();

  return (
    <div className="dark-container">
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>

      <div className="gospel-container">
        <RevealSection id="kidsContent" image="/images/pages/jesus-cross.jpg" opacity={0.015}>
          <div className="pt-5 pb-5 reveal">
            <DocumentRenderer document={pageContent ?? []} />
          </div>
        </RevealSection>
      </div>
    </div>
  );
}

export async function generateMetadata() {
  const pageData = await getPageData("gospel");

  return buildMetadata({
    title: pageData?.title,
    excerpt: pageData?.excerpt,
    image: pageData?.image,
    path: "/gospel",
  });
}
