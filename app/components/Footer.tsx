import Link from "next/link";
import { getChurchInfoData } from "../api/keystatic/lib/keystatic";
import { toTelLink } from "@/app/utils";

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
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/contact">Service Times / Contact</Link>
            </li>
            <li>
              <Link href="/Linkbout">About Us</Link>
            </li>
            <li>
              <Link href="/plan-your-visit">Plan Your Visit</Link>
            </li>
            <li>
              <Link href="/kids">Resurrection Kids</Link>
            </li>
            <li>
              <Link href="/anglican">The Anglican Way</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li className="mt-5">
              <div className="d-flex flex-column social-links">
                <span className="footer-label mb-2">Social Links</span>
                <div className="d-flex">
                  <Link href="https://www.facebook.com/resurrectionrockhill" target="_blank">
                    <i className="bi bi-facebook me-2" />
                  </Link>
                  <Link href="https://www.instagram.com/resurrectionrockhill/" target="_blank">
                    <i className="bi bi-instagram" />
                  </Link>
                </div>
              </div>
            </li>
          </ul>
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
    </footer>
  );
}
