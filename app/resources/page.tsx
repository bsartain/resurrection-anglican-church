import HeroImage from "../components/HeroImage";
import { getPageData } from "../api/keystatic/lib/keystatic";
import ResourcesComponent from "../components/resources/ResourcesComponent";

export default async function Resources() {
  const pageData = (await getPageData("resources")) ?? null;
  const pageContent = await pageData?.content();

  return (
    <div className="resource-container dark-container">
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>
      <ResourcesComponent pageData={pageData} pageContent={pageContent} />
    </div>
  );
}
