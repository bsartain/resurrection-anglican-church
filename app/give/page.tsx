import HeroImage from "../components/HeroImage";
import { getPageData } from "../api/keystatic/lib/keystatic";
import GiveComponent from "../components/give/GiveComponent";

export default async function Give() {
  const pageData = (await getPageData("give")) ?? null;
  const pageContent = await pageData?.content();

  return (
    <div className="give-container dark-container">
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>
      <GiveComponent pageData={pageData} pageContent={pageContent} />
    </div>
  );
}
