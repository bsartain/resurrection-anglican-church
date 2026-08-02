import { getChurchInfoData } from "../api/keystatic/lib/keystatic";
import { toTelLink } from "@/app/utils";
import FooterNavLinks from "./FooterNavLinks";
import LiturgyBottomDrawer from "./LiturgyBottomDrawer";

export default async function Footer() {
  const churchInfo = await getChurchInfoData();
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Column */}
        <div className="footer-info">
          <div className="footer-gathering">
            <span className="footer-label">Service Time</span>
            <span className="footer-time">{churchInfo?.serviceTime}</span>
          </div>

          <div className="footer-divider" />

          <div className="footer-info-block">
            <span className="footer-label">Address</span>
            {churchInfo?.address}
          </div>

          <div className="footer-info-block">
            <span className="footer-label">Childcare</span>
            {churchInfo?.childcareMessage}
          </div>

          <div className="footer-info-block">
            <span className="footer-label">Phone</span>
            <div>
              <a href={churchInfo?.phone ? toTelLink(churchInfo?.phone) : churchInfo?.phone}>{churchInfo?.phone}</a>
            </div>
          </div>
        </div>

        {/* Footer Sitemap / Quick Links Section */}
        <div className="footer-sitemap">
          <span className="footer-label">QUICK LINKS</span>
          <FooterNavLinks />
        </div>

        {/* Right Column - Google Map */}
        <div className="footer-map">
          <div
            dangerouslySetInnerHTML={{
              __html: churchInfo?.googleMapEmbed ?? "",
            }}
          />
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Resurrection Anglican Church. All rights reserved.</p>
      </div>
      <LiturgyBottomDrawer />
    </footer>
  );
}
