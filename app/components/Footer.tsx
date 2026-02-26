import { DocumentElement } from "@keystatic/core";
import { getPageData } from "../api/keystatic/lib/keystatic";
import { DocumentRenderer } from "@keystatic/core/renderer";

type ContentItem = DocumentElement & {
  title: string;
  type: string;
  href?: string;
  children: {
    text: string;
    href?: string;
    code?: string[];
  }[];
};

interface Item {
  title: string;
  type?: string;
}

export default async function Footer() {
  const pageData = await getPageData("contact");
  const serviceInfo = await pageData?.subsections.find((item: Item) => item.title.toLowerCase().includes("service"));
  const serviceContent = await serviceInfo?.content();
  const address = await pageData?.subsections.find((item: Item) => item.title.toLowerCase().includes("address"));
  const addressContent = await address?.content();
  const childcare = await pageData?.subsections.find((item: Item) => item.title.toLowerCase().includes("childcare"));
  const childcareContent = await childcare?.content();
  const phone = await pageData?.subsections.find((item: Item) => item.title.toLowerCase().includes("phone"));
  const phoneContent = (await phone?.content()) as ContentItem[];
  const phoneLink = phoneContent?.flatMap((item) => item.children)?.find((child) => child.href)?.href;
  const googleMap = await pageData?.subsections.find((item: Item) => item.title.toLowerCase().includes("google"));
  const googleMapContent = (await googleMap?.content()) as ContentItem[];
  const googleMapCode = googleMapContent?.find((item: Item) => item.type === "code")?.children[0].text;

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Column */}
        <div className="footer-info">
          <div className="footer-gathering">
            <span className="footer-label">{serviceInfo?.title}</span>
            <span className="footer-time">{serviceContent && <DocumentRenderer document={serviceContent} />}</span>
          </div>

          <div className="footer-divider" />

          <div className="footer-info-block">
            <span className="footer-label">{address?.title}</span>
            {addressContent && <DocumentRenderer document={addressContent} />}
          </div>

          <div className="footer-info-block">
            <span className="footer-label">{childcare?.title}</span>
            {childcareContent && <DocumentRenderer document={childcareContent} />}
          </div>

          <div className="footer-info-block">
            <span className="footer-label">{phone?.title}</span>
            <p>
              <a href={phoneLink}>{phoneContent && <DocumentRenderer document={phoneContent} />}</a>
            </p>
          </div>
        </div>

        {/* Right Column - Google Map */}
        <div className="footer-map">
          <div
            dangerouslySetInnerHTML={{
              __html: googleMapCode ?? "",
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
