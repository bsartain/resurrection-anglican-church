import HeroImage from "../../components/HeroImage";
import { getPageData, getChurchInfoData } from "../../api/keystatic/lib/keystatic";
import { Container } from "react-bootstrap";
import ContactForm from "../../components/ContactForm";
import RevealSection from "../../components/RevealSection";
import { buildMetadata } from "../../lib/buildMetadata";
import { PageModel } from "../../models/pageModel";
import { toTelLink } from "../../utils";

export default async function Contact() {
  const pageData = (await getPageData("contact")) as PageModel | null;
  const churchInfo = await getChurchInfoData();

  return (
    <div className="contact-container">
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>

      <RevealSection id="contactInfo">
        <Container className="mt-5 mb-5 contact-component-container">
          <div className="contact-info">
            <div className="contact-subsections">
              <h3>Service Times</h3>
              <p>{churchInfo?.serviceTime}</p>
            </div>
            <div className="contact-subsections">
              <h3>Address</h3>
              <p>{churchInfo?.address}</p>
            </div>
            <div className="contact-subsections">
              <h3>Childcare</h3>
              <p>{churchInfo?.childcareMessage}</p>
            </div>
            <div className="contact-subsections">
              <h3>Phone</h3>
              <p>
                <a style={{ color: "#c8c4bc", textDecoration: "none" }} href={churchInfo?.phone ? toTelLink(churchInfo?.phone) : churchInfo?.phone}>
                  {churchInfo?.phone}
                </a>
              </p>
            </div>
            {churchInfo?.planYourVisitLink ? (
              <a className="btn btn-lg btn-primary w-100" href={churchInfo.planYourVisitLink}>
                Plan Your Visit
              </a>
            ) : null}
          </div>
          <ContactForm />
        </Container>
      </RevealSection>

      <div
        dangerouslySetInnerHTML={{
          __html: churchInfo?.googleMapEmbed ?? "",
        }}
      />
    </div>
  );
}

export async function generateMetadata() {
  const pageData = (await getPageData("contact")) as PageModel | null;

  return buildMetadata({
    title: pageData?.title,
    excerpt: pageData?.excerpt,
    image: pageData?.image,
    path: "/contact",
  });
}
