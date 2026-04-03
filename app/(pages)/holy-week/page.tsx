import HeroImage from "../../components/HeroImage";
import { getPageData } from "../../api/keystatic/lib/keystatic";
import { Container } from "react-bootstrap";
import { DocumentRenderer } from "@keystatic/core/renderer";
import RevealSection from "../../components/RevealSection";
import { buildMetadata } from "../../lib/buildMetadata";
import { PageModel, Content } from "../../models/pageModel";
import Link from "next/link";
import PlanVisitContactForm from "@/app/components/PlanVisitContactForm";

interface HolyWeekService {
  day: string;
  date: string;
  time: string;
  name: string;
  description: string;
  icon: string;
}

const services: HolyWeekService[] = [
  {
    day: "Sunday",
    date: "March 29, 2026",
    time: "4:00 PM",
    name: "Palm Sunday",
    description: "Procession of palms and Holy Eucharist. We begin the week celebrating Christ's triumphal entry into Jerusalem.",
    icon: "/images/icons/icon-palm.jpg",
  },
  {
    day: "Thursday",
    date: "April 2, 2026",
    time: "6:00 PM",
    name: "Maundy Thursday",
    description: "Foot washing, Holy Eucharist, and the Stripping of the Altar. We remember Christ's final supper with his disciples.",
    icon: "/images/icons/icon-communion.jpg",
  },
  {
    day: "Friday",
    date: "April 3, 2026",
    time: "6:00 PM",
    name: "Good Friday",
    description:
      "Solemn Liturgy of Good Friday with meditation on the Passion of Christ, Stations of the cross then prayer vigil begins 8pm (ends 4/4pm). Volunteers select time slots to pray.",
    icon: "/images/icons/icon-thorns.jpg",
  },
  {
    day: "Saturday",
    date: "April 4, 2026",
    time: "8:00 PM",
    name: "Easter Vigil",
    description: "The Great Vigil of Easter—lighting of the Paschal Candle and the first celebration of the Resurrection.",
    icon: "/images/icons/icon-crosses.jpg",
  },
  {
    day: "Sunday",
    date: "April 5, 2026",
    time: "4:00 PM",
    name: "Easter Sunday",
    description: "Festive Holy Eucharist celebrating the Resurrection of Jesus Christ. He is risen! Egg hunt and Potluck after evening service.",
    icon: "/images/icons/icon-tomb.jpg",
  },
];

const SubsectionLeft: React.FC<{ sectionContent: Content }> = async ({ sectionContent }) => {
  const content = await sectionContent.content();
  return (
    <section>
      <RevealSection id={`holy-week-left-${sectionContent.title}`}>
        {sectionContent.image ? <div className="story-image rounded" style={{ backgroundImage: `url("${sectionContent.image}")` }} /> : null}
        <div>
          <h2>{sectionContent.title}</h2>
          <DocumentRenderer document={content} />
        </div>
      </RevealSection>
    </section>
  );
};

const SubsectionRight: React.FC<{ sectionContent: Content }> = async ({ sectionContent }) => {
  const content = await sectionContent.content();
  return (
    <section>
      <RevealSection id={`holy-week-right-${sectionContent.title}`}>
        <div className="story-container">
          <div>
            <h2>{sectionContent.title}</h2>
            <DocumentRenderer document={content} />
          </div>
          {sectionContent.image ? <div className="story-image rounded" style={{ backgroundImage: `url("${sectionContent.image}")` }} /> : null}
        </div>
      </RevealSection>
    </section>
  );
};

export default async function HolyWeek() {
  const pageData = (await getPageData("holy-week")) as PageModel | null;
  const pageContent = await pageData?.content();

  return (
    <div className="holy-week-container pt-2">
      <HeroImage image={pageData?.image ? pageData.image : "/images/pages/cross-lent.webp"}>{pageData?.title ?? "Holy Week Services"}</HeroImage>

      {/* Service Schedule */}
      <section>
        <RevealSection id="holyWeekSchedule" image="/images/pages/jesus-cross.jpg" opacity={0.02} className="dark-background-home-section">
          <Container className="reveal" style={{ maxWidth: "800px" }}>
            <h2 className="text-center pb-5 pt-5">Holy Week Services</h2>
            <p className="holy-week-subheadline text-center mb-5">
              Join us as we journey from Palm Sunday to Easter Sunday, celebrating the resurrection of Jesus Christ.
            </p>
            <DocumentRenderer document={pageContent ?? []} />
            <div className="d-flex justify-content-center mt-5 mb-5 w-100">
              <hr className="w-25" />
            </div>
            <div className="holy-week-services">
              {services.map((service, index) => (
                <div key={index} className="holy-week-service-card">
                  <div className="holy-week-service-icon" style={{ backgroundImage: `url("${service.icon}")` }}></div>
                  <div className="holy-week-service-info">
                    <div className="holy-week-service-header">
                      <span className="holy-week-service-name">{service.name}</span>
                      <span className="holy-week-service-datetime">
                        {service.date} &middot; {service.time}
                      </span>
                    </div>
                    <p className="holy-week-service-desc">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <h2>Let us know you're coming!</h2>
              <PlanVisitContactForm />
              {/* <Link href="/plan-your-visit" className="btn btn-lg btn-primary" target="_blank">
                Get Directions &amp; Plan Your Visit
              </Link> */}
            </div>
            {pageData?.subsections && pageData.subsections.length > 0
              ? pageData.subsections.map((item: Content, index: number) =>
                  item.imageDirection === "right" ? (
                    <div key={index} style={{ marginTop: "100px" }} className="holy-week-devotional">
                      <SubsectionRight sectionContent={item} />
                    </div>
                  ) : (
                    <div key={index} style={{ marginTop: "100px" }}>
                      <SubsectionLeft sectionContent={item} />
                    </div>
                  )
                )
              : null}
          </Container>
        </RevealSection>
      </section>

      {/* Devotional Quote */}
      <RevealSection id="holyWeekDevotional">
        <Container className="reveal">
          <div className="holy-week-devotional">
            <blockquote className="holy-week-quote">
              <p>
                &ldquo;Worthy is the Lamb who was slain, to receive power and wealth and wisdom and might and honor and glory and blessing!&rdquo;
              </p>
              <footer>— Revelation 5:12</footer>
            </blockquote>
          </div>
        </Container>
      </RevealSection>
    </div>
  );
}

export async function generateMetadata() {
  const pageData = (await getPageData("holy-week")) as PageModel | null;

  return buildMetadata({
    title: pageData?.title ?? "Holy Week & Easter",
    excerpt: pageData?.excerpt,
    image: pageData?.image,
    path: "/holy-week",
  });
}
