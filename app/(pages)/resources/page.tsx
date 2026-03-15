import HeroImage from "../../components/HeroImage";
import { getPageData } from "../../api/keystatic/lib/keystatic";
import { Container } from "react-bootstrap";
import { DocumentRenderer } from "@keystatic/core/renderer";
import RevealSection from "../../components/RevealSection";
import BookCarousel from "../../components/BooksCarousel";
import { buildMetadata } from "../../lib/buildMetadata";
import { PageModel, Value } from "../../models/pageModel";
import ResourcesInteractive from "../../components/ResourcesInteractive";

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

        <ResourcesInteractive anglicanTitles={anglicanTitles} />
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
