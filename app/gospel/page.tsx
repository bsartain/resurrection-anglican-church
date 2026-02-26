import HeroImage from "../components/HeroImage";
import { getPageData } from "../api/keystatic/lib/keystatic";
import GospelComponent from "../components/gospel/GospelComponent";

export default async function Contact() {
  const pageData = await getPageData("gospel");
  const pageContent = await pageData?.content();

  return (
    <div className="dark-container">
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>
      <GospelComponent pageContent={pageContent} />
    </div>
  );
}
