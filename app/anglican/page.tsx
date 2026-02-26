import HeroImage from "../components/HeroImage";
import { getPageData } from "../api/keystatic/lib/keystatic";
import AnglicanComponent from "../components/anglican/AnglicanComponent";

export default async function Anglican() {
  const pageData = await getPageData("anglican");
  const pageContent = await pageData?.content();

  return (
    <div className="anglican-container">
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>
      <AnglicanComponent pageData={pageData} pageContent={pageContent} />
    </div>
  );
}
