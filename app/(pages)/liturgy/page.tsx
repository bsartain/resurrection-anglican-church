import { Container } from "react-bootstrap";
import HeroImage from "../../components/HeroImage";
import RevealSection from "../../components/RevealSection";
import { buildMetadata } from "../../lib/buildMetadata";
import { getEsvPassage, getPlanningCenterServicesData, getPsalter } from "../../lib/getProPresenterData";
import LiturgyDrawerSync from "../../components/LiturgyDrawerSync";
import type { ServiceDataModel } from "../../models/serviceModel";

export const dynamic = "force-dynamic";

export default async function Liturgy() {
  const serviceData = await getPlanningCenterServicesData();

  const renderBibleVerses = async (verseReference: any, readingType: string) => {
    if (readingType === "Psalm Reading") {
      const psalterPassage = await getPsalter(verseReference);
      return psalterPassage?.psalmData;
    } else {
      const verseText = verseReference.replace(/<[^>]*>/g, "");
      const verse = await getEsvPassage(verseText, process.env.ESV_API_KEY);
      return verse.text;
    }
  };

  // Resolve all async verse lookups up front so JSX renders plain strings
  // (a Promise dropped into dangerouslySetInnerHTML renders as "[object Promise]").
  const resolvedServiceData = await Promise.all(
    serviceData.map(async (service: ServiceDataModel) => ({
      ...service,
      resolvedHtml:
        service.title === "NT Reading" || service.title === "OT Reading" || service.title === "Psalm Reading"
          ? await renderBibleVerses(service.html_details, service.title)
          : service.html_details,
    }))
  );

  return (
    <div className="liturgy-container">
      <LiturgyDrawerSync data={resolvedServiceData} />
      <HeroImage image="/images/pages/jesus-resurrection.jpg">{"Liturgy"}</HeroImage>
      <div>
        <RevealSection id="liturgyContent" image="/images/pages/art.webp" opacity={0.04}>
          <Container className="pt-5 pb-5 reveal">
            {resolvedServiceData.length > 0
              ? resolvedServiceData.map((service) => {
                  return (
                    <div key={service.sequence} id={`liturgy-section-${service.sequence}`} className="service-data-container">
                      <h2>{service.title}</h2>
                      {service.title === "Psalm Reading" ? (
                        <>
                          <h3 dangerouslySetInnerHTML={{ __html: service.html_details }} className="mt-4 mb-4" />
                          <hr className="mb-5 mt-5" style={{ width: "50px" }} />
                        </>
                      ) : null}
                      {Array.isArray(service.resolvedHtml) && service.resolvedHtml.length > 0 ? (
                        service.resolvedHtml.map((verse: any) => {
                          return (
                            <div key={verse.number} className="psalter-verses">
                              <div className="first-half mb-2">{verse.first_half}&#42;</div>
                              <div className="second-half fw-bold mb-5 ms-3">{verse.second_half}</div>
                            </div>
                          );
                        })
                      ) : (
                        <div>
                          <div dangerouslySetInnerHTML={{ __html: service.resolvedHtml }} className={`${service.item_type}`} />
                          {service.title === "OT Reading" || service.title === "NT Reading" ? (
                            <div>
                              <div>The Word of the Lord</div>
                              <div>
                                <strong>Thanks be to God.</strong>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}
                      <hr className="liturgy-line-break" />
                    </div>
                  );
                })
              : null}
          </Container>
        </RevealSection>
      </div>
    </div>
  );
}

export async function generateMetadata() {
  return buildMetadata({
    title: "Liturgy",
    excerpt: "Follow along with the current Sunday service liturgy.",
    image: "/images/pages/jesus-resurrection.jpg",
    path: "/liturgy",
  });
}
