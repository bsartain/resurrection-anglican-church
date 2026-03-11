import { getAllSermons } from "@/app/api/keystatic/lib/keystatic";
import { NextResponse } from "next/server";

const SITE_URL = "https://resurrectionanglicanchurch.com";
const PODCAST_TITLE = "Resurrection Anglican Church Sermons";
const PODCAST_DESCRIPTION =
  "Sermons from Resurrection Anglican Church in Rock Hill, South Carolina. We are a community gathered around Word, Sacrament, and Prayer.";
const PODCAST_AUTHOR = "Resurrection Anglican Church";
const PODCAST_EMAIL = "info@resurrectionanglicanchurch.com";
const PODCAST_IMAGE = `${SITE_URL}/images/pages/bill-danial-communion.jpg`;
const PODCAST_LANGUAGE = "en-us";
const PODCAST_CATEGORY = "Religion &amp; Spirituality";

function extractDriveId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET() {
  const sermons = await getAllSermons();

  const sorted = sermons.sort((a, b) => {
    const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
    const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
    return dateB - dateA;
  });

  const items = sorted
    .map((sermon) => {
      const title = escapeXml(String(sermon.entry.title));
      const description = escapeXml(sermon.entry.excerpt ?? sermon.entry.biblePassages ?? "");
      const pubDate = sermon.entry.date ? new Date(sermon.entry.date).toUTCString() : new Date().toUTCString();
      const link = `${SITE_URL}/sermons/${sermon.slug}`;
      const guid = link;

      const driveId = sermon.entry.audio ? extractDriveId(sermon.entry.audio) : null;
      const audioUrl = driveId ? `https://drive.google.com/uc?export=download&id=${driveId}` : "";

      const enclosure = audioUrl ? `<enclosure url="${audioUrl}" length="0" type="audio/mpeg" />` : "";

      const duration = sermon.entry.duration ? `<itunes:duration>${sermon.entry.duration}</itunes:duration>` : "";
      const imageUrl = sermon.entry.image ? `${SITE_URL}${sermon.entry.image}` : PODCAST_IMAGE;
      const pastor = sermon.entry.pastor ? escapeXml(sermon.entry.pastor) : PODCAST_AUTHOR;
      const series = sermon.entry.series ? `<itunes:subtitle>${escapeXml(sermon.entry.series)}</itunes:subtitle>` : "";

      return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${guid}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      ${enclosure}
      <itunes:title>${title}</itunes:title>
      <itunes:author>${pastor}</itunes:author>
      ${series}
      ${duration}
      <itunes:image href="${imageUrl}" />
      <itunes:explicit>false</itunes:explicit>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${PODCAST_TITLE}</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/api/podcast.xml" rel="self" type="application/rss+xml" />
    <description>${PODCAST_DESCRIPTION}</description>
    <language>${PODCAST_LANGUAGE}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <itunes:author>${PODCAST_AUTHOR}</itunes:author>
    <itunes:owner>
      <itunes:name>${PODCAST_AUTHOR}</itunes:name>
      <itunes:email>${PODCAST_EMAIL}</itunes:email>
    </itunes:owner>
    <itunes:image href="${PODCAST_IMAGE}" />
    <itunes:category text="${PODCAST_CATEGORY}" />
    <itunes:explicit>false</itunes:explicit>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
