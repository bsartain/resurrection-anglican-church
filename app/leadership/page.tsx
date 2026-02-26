import HeroImage from "../components/HeroImage";
import { getPageData } from "../api/keystatic/lib/keystatic";
import LeadershipComponent from "../components/leadership/LeadershipComponent";

interface Leadership {
  image: string | null;
  caption: string;
  subCaption: string;
}

export default async function Leadership() {
  const pageData = await getPageData("leadership");
  const pageContent = await pageData?.content();

  return (
    <div className="dark-container">
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>
      <LeadershipComponent pageContent={pageContent} pageData={pageData} />
    </div>
  );
}
