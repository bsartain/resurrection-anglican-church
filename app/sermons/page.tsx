import HeroImage from "../components/HeroImage";
import RevealSection from "../components/RevealSection";
import { getAllSermons } from "../api/keystatic/lib/keystatic";
import { buildMetadata } from "../lib/buildMetadata";
import { DocumentRenderer } from "@keystatic/core/renderer";
import Link from "next/link";
import { Accordion } from "react-bootstrap";
import SermonExcerpt from "../components/SermonExcerpt";

function extractDriveId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export default async function Sermons() {
  const sermons = await getAllSermons();

  const sorted = sermons.sort((a, b) => {
    const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
    const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div>
      <HeroImage image={sorted[0].entry.image ? sorted[0].entry.image : ""}>{sorted[0].entry.title}</HeroImage>

      <RevealSection id="sermonListing" image="/images/pages/jesus-cross.jpg" opacity={0.04}>
        <div className="sermon-grid reveal pt-5 pb-5">
          {sorted.map(async (sermon) => {
            const driveId = sermon.entry.audio ? extractDriveId(sermon.entry.audio) : null;
            const thumbUrl = driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w600` : sermon.entry.image ?? null;
            return (
              <>
                <Link key={sermon.slug} href={`/sermons/${sermon.slug}`} className="sermon-card">
                  <div className="sermon-card-image" style={{ backgroundImage: thumbUrl ? `url(${thumbUrl})` : undefined }}>
                    {sermon.entry.date && (
                      <span className="sermon-card-date">
                        {new Date(sermon.entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    )}
                    <div className="sermon-card-overlay" style={{ backgroundImage: `url("${sermon.entry.image}")` }}></div>
                  </div>
                  <div className="sermon-card-body">
                    {sermon.entry.series && <p className="sermon-card-series">{sermon.entry.series}</p>}
                    <h3 className="sermon-card-title">{String(sermon.entry.title)}</h3>
                    {/* <DocumentRenderer document={sermonContent} /> */}
                    <div>
                      <p>{sermon.entry.excerpt}</p>
                    </div>
                    <div className="sermon-card-meta">
                      {sermon.entry.biblePassages && (
                        <span className="sermon-card-tag">
                          <i className="bi bi-book" /> {sermon.entry.biblePassages}
                        </span>
                      )}
                      {sermon.entry.duration && (
                        <span className="sermon-card-tag sermon-card-tag--time">
                          <i className="bi bi-clock" /> {sermon.entry.duration}
                        </span>
                      )}
                    </div>
                    {sermon.entry.pastor && <p className="sermon-card-pastor">— {sermon.entry.pastor}</p>}
                  </div>
                </Link>
              </>
            );
          })}
        </div>
      </RevealSection>
    </div>
  );
}

export function generateMetadata() {
  return buildMetadata({
    title: "Sermons | Resurrection Anglican Church",
    excerpt: "Listen to sermons from Resurrection Anglican Church in Rock Hill, SC.",
    image: "/images/pages/bill-danial-communion.jpg",
    path: "/sermons",
  });
}
