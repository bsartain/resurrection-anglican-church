import HeroImage from "../../components/HeroImage";
import { getPageData } from "../../api/keystatic/lib/keystatic";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { Container } from "react-bootstrap";
import CoffeeDateButton from "../../components/CoffeeDateButton";
import RevealSection from "../../components/RevealSection";
import { buildMetadata } from "../../lib/buildMetadata";
import { PageModel } from "../../models/pageModel";

interface Leadership {
  image: string | null;
  caption: string;
  subCaption: string;
}

interface VestryModel {
  name: string | null | undefined;
  role?: string | null | undefined;
}

const vestryMembers = [
  { name: "Joe Mester", role: "Senior Warden" },
  { name: "Kim Allman", role: "Junior Warden/Clerk" },
  { name: "Nick Wimmer", role: "Treasurer" },
  { name: "Clinton Dix" },
  { name: "Lisa Massotti" },
  { name: "Cynthia Weston" },
];

export default async function LeadershipPage() {
  const pageData = (await getPageData("leadership")) as PageModel | null;
  const pageContent = await pageData?.content();

  let parishLeaders: Leadership[] = [];
  let dioceseLeadership: Leadership[] = [];
  if (pageData?.multipleImages?.value) {
    parishLeaders = pageData.multipleImages.value.filter((item: Leadership) => !item.caption.includes("Rt."));
    dioceseLeadership = pageData.multipleImages.value.filter((item: Leadership) => item.caption.includes("Rt."));
  }

  return (
    <div className="dark-container">
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>

      <RevealSection id="leadershipSection" image="/images/pages/icon-resurrection.jpg" opacity={0.02}>
        <Container className="pt-5 pb-5">
          {pageContent ? <DocumentRenderer document={pageContent} /> : null}

          {parishLeaders?.length > 0 ? (
            <div className="row">
              <h1 className="text-center mt-5">Parish Leaders</h1>
              {parishLeaders.map((leader: Leadership) => (
                <div className="col-md-4 mb-4" key={leader.image}>
                  <div className="leader-card" style={{ backgroundImage: `url(${leader.image})` }}>
                    <div className="leader-drawer">
                      <h3 className="leader-name">{leader.caption}</h3>
                      <p className="leader-sub">{leader.subCaption}</p>
                      {leader.caption.toLowerCase().includes("bill scott") ? (
                        <div className="coffee-button">
                          <CoffeeDateButton />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="row mt-5 mb-5 vestry">
            <h1 className="text-center">Vestry</h1>
            {vestryMembers.map((member: VestryModel, index: number) => (
              <div key={index} className="col-sm-4 mb-3 mb-sm-0 mt-4 mb-2">
                <div className="card">
                  <div className="card-body">
                    <p className="card-text">{member.name}</p>
                    <h5 className="card-title">{member.role}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {dioceseLeadership.length > 0 ? (
            <div className="row">
              <h1 className="text-center mt-5">Diocese Leadership</h1>
              <p>
                In the Anglican Church, a diocese is a regional family of congregations under the spiritual oversight of bishops. The bishops
                shepherds the clergy, guards the doctrine of the Church, and ensures faithfulness to Scripture and the Anglican tradition.
              </p>
              {dioceseLeadership.map((leader: Leadership) => (
                <div className="col-md-4 mb-4" key={leader.image}>
                  <div className="leader-card" style={{ backgroundImage: `url(${leader.image})` }}>
                    <div className="leader-drawer">
                      <h3 className="leader-name">{leader.caption}</h3>
                      <p className="leader-sub">{leader.subCaption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </Container>
      </RevealSection>
    </div>
  );
}

export async function generateMetadata() {
  const pageData = (await getPageData("leadership")) as PageModel | null;

  return buildMetadata({
    title: pageData?.title,
    excerpt: pageData?.excerpt,
    image: pageData?.image,
    path: "/leadership",
  });
}
