import HeroImage from "../components/HeroImage";
import { getPageData } from "../api/keystatic/lib/keystatic";
import ContactComponent from "../components/contact/ContactComponent";

export default async function Contact() {
  const pageData = await getPageData("contact");

  return (
    <div className="contact-container">
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>
      <ContactComponent pageData={pageData} />
    </div>
  );
}
