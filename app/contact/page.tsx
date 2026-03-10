import HeroImage from "../components/HeroImage";
import { getPageData } from "../api/keystatic/lib/keystatic";
import { DocumentElement } from "@keystatic/core";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { Container } from "react-bootstrap";
import ContactForm from "../components/ContactForm";
import RevealSection from "../components/RevealSection";
import { buildMetadata } from "../lib/buildMetadata";
import { PageModel, Content } from "../models/pageModel";
import Link from "next/link";

type GoogleMapItem = DocumentElement & {
  type: string;
  children: { text: string }[];
};

export default async function Contact() {
  const pageData = (await getPageData("contact")) as PageModel | null;
  const googleMapSubsection = pageData?.subsections.find((item: Content) => item.title?.includes("Google"));
  const googleMapArray = await googleMapSubsection?.content();

  return (
    <div className="contact-container">
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>

      <RevealSection id="contactInfo">
        <Container className="mt-5 mb-5 contact-component-container">
          <div className="contact-info">
            {pageData?.subsections
              ? pageData.subsections.map(async (item: Content, index: number) => {
                  const content = await item.content();
                  if (item.title && !item.title.includes("Google")) {
                    return (
                      <div key={index} className="contact-subsections">
                        <h3>{item.title}</h3>
                        <DocumentRenderer document={content} />
                      </div>
                    );
                  }
                })
              : null}
            <Link className="btn btn-lg btn-primary w-100" href="/plan-your-visit">
              Plan Your Visit
            </Link>
          </div>
          <ContactForm />
        </Container>
      </RevealSection>

      {googleMapArray && googleMapArray.length > 0
        ? (googleMapArray as GoogleMapItem[]).map((item: GoogleMapItem, index: number) => {
            if (item.type === "code") {
              return (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html: item.children[0].text,
                  }}
                />
              );
            }
          })
        : null}
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
