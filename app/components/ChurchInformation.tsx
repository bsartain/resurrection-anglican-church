import RevealSection from "./RevealSection";
import Link from "next/link";
import { getChurchInfoData } from "../api/keystatic/lib/keystatic";

export default async function ChurchInformation() {
  const churchInfo = await getChurchInfoData();

  if (!churchInfo) {
    return <div>Page data not found.</div>;
  }

  return (
    <RevealSection id="come-worship" className="home-section dark-background-home-section" image="/images/pages/icon-resurrection.jpg" opacity={0.02}>
      <div className="worship-two-col">
        <div className="worship-left">
          <h2 className="mb-4">Come Worship With Us</h2>
          <div className="worship-service-block">
            <p className="worship-label">Service Times</p>
            <p className="worship-time">{churchInfo.serviceTime}</p>
          </div>
          <div className="worship-service-block">
            <p className="worship-label">Address</p>
            <p className="worship-time">{churchInfo.address}</p>
          </div>
          <div className="worship-childcare-block">
            <p className="worship-label">Children&apos;s Ministry</p>
            <p>{churchInfo.childcareMessage}</p>
          </div>
          {churchInfo.planYourVisitLink ? (
            <Link
              className="btn btn-lg btn-primary mt-2 rounded"
              href="/plan-your-visit"
              style={{ background: "#ffffff", color: "#2b2b2b", fontSize: "25px" }}
            >
              Plan Your Visit
            </Link>
          ) : null}
        </div>
        <div className="worship-right">
          <div dangerouslySetInnerHTML={{ __html: churchInfo.googleMapEmbed }} />
        </div>
      </div>
    </RevealSection>
  );
}
