import HeroImage from "@/app/components/HeroImage";
import { getSermon, getAllSermons } from "@/app/api/keystatic/lib/keystatic";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { Container } from "react-bootstrap";
import RevealSection from "@/app/components/RevealSection";
import { buildMetadata } from "@/app/lib/buildMetadata";
import { notFound } from "next/navigation";
import Link from "next/link";

function extractDriveId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export default async function SermonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sermon = await getSermon(slug);
  console.log("🚀 ~ SermonPage ~ sermon:", sermon);

  if (!sermon) notFound();

  const content = await sermon.content;
  const driveId = sermon.audio ? extractDriveId(sermon.audio) : null;
  const embedUrl = driveId ? `https://drive.google.com/file/d/${driveId}/preview` : null;
  const title = String(sermon.title);

  return (
    <div className="sermon-post">
      <HeroImage image={sermon.image ?? "/images/pages/bill-danial-communion.jpg"}>{title}</HeroImage>

      <RevealSection id="sermonContent" image="/images/pages/jesus-cross.jpg" opacity={0.01}>
        <Container className="pt-5 pb-5 reveal">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="blog-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/sermons">Sermons</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {title}
              </li>
            </ol>
          </nav>

          <div className="sermon-post-layout">
            {/* Left: player + meta */}
            <div className="sermon-post-main">
              {/* Audio player */}
              {embedUrl ? (
                <div className="sermon-audio-player">
                  {/* <iframe src={embedUrl} width="100%" height="80" allow="autoplay" title={`${title} audio`} style={{ border: "none" }} /> */}
                  <iframe
                    data-testid="embed-iframe"
                    style={{ borderRadius: "12px" }}
                    src="https://open.spotify.com/embed/episode/25Q8es3pgalgjHXGzteVll?utm_source=generator"
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                </div>
              ) : sermon.youTubLink ? (
                <div className="sermon-youtube">
                  <iframe
                    src={sermon.youTubLink.replace("watch?v=", "embed/")}
                    width="100%"
                    height="400"
                    title={`${title} video`}
                    allowFullScreen
                    style={{ border: "none", borderRadius: "8px" }}
                  />
                </div>
              ) : null}

              {/* Content / description */}
              <div className="sermon-post-content mt-4">
                <DocumentRenderer document={content ?? []} />
              </div>
            </div>

            {/* Right: details sidebar */}
            <aside className="sermon-post-sidebar">
              {sermon.series && (
                <div className="sermon-sidebar-block">
                  <p className="sermon-sidebar-label">Series</p>
                  <p className="sermon-sidebar-value">{sermon.series}</p>
                </div>
              )}
              {sermon.date && (
                <div className="sermon-sidebar-block">
                  <p className="sermon-sidebar-label">Date</p>
                  <p className="sermon-sidebar-value">
                    {new Date(sermon.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              )}
              {sermon.biblePassages && (
                <div className="sermon-sidebar-block">
                  <p className="sermon-sidebar-label">Scripture</p>
                  <p className="sermon-sidebar-value">
                    <i className="bi bi-book me-2" />
                    {sermon.biblePassages}
                  </p>
                </div>
              )}
              {sermon.pastor && (
                <div className="sermon-sidebar-block">
                  <p className="sermon-sidebar-label">Preacher</p>
                  <p className="sermon-sidebar-value">{sermon.pastor}</p>
                </div>
              )}
              {sermon.duration && (
                <div className="sermon-sidebar-block">
                  <p className="sermon-sidebar-label">Duration</p>
                  <p className="sermon-sidebar-value">
                    <i className="bi bi-clock me-2" />
                    {sermon.duration}
                  </p>
                </div>
              )}

              <Link href="/sermons" className="btn btn-primary-light w-100 mt-3">
                <i className="bi bi-arrow-left me-2" />
                All Sermons
              </Link>

              <a href="/api/podcast.xml" className="btn btn-outline-secondary w-100 mt-2" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-rss me-2" />
                Subscribe to Podcast
              </a>
            </aside>
          </div>
        </Container>
      </RevealSection>
    </div>
  );
}

export async function generateStaticParams() {
  const sermons = await getAllSermons();
  return sermons.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sermon = await getSermon(slug);
  const title = sermon ? String(sermon.title) : "Sermon";

  return buildMetadata({
    title: `${title} | Resurrection Anglican Church`,
    excerpt: sermon?.excerpt ?? undefined,
    image: sermon?.image ?? undefined,
    path: `/sermons/${slug}`,
  });
}
