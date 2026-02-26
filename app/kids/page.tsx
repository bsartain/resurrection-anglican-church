import { getPageData } from "../api/keystatic/lib/keystatic";
import KidsComponent from "../components/kids/KidsComponent";

export default async function Kids() {
  const pageData = await getPageData("kids");
  const pageContent = await pageData?.content();
  return (
    <div>
      <KidsComponent pageData={pageData} pageContent={pageContent} />
    </div>
  );
}
