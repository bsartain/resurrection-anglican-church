import { ProPresenterData } from "../models/proPresenterModel";
const appId = process.env.PCO_APP_ID;
const secret = process.env.PCO_SECRET;

export async function getProPresenterData(): Promise<ProPresenterData> {
  const url = "https://church-liturgy-default-rtdb.firebaseio.com/.json";

  const res = await fetch(url, { next: { revalidate: 60 } }); // Optional: Cache/revalidate every 60 seconds
  if (!res.ok) {
    throw new Error("Failed to fetch liturgy data");
  }

  return res.json();
}

export async function getPlanningCenterServicesData(planId: string = "88692794") {
  if (!appId || !secret) {
    throw new Error("Missing Planning Center credentials");
  }

  const authHeader = "Basic " + Buffer.from(`${appId}:${secret}`).toString("base64");

  // 1. Get all service types
  const serviceTypesRes = await fetch("https://api.planningcenteronline.com/services/v2/service_types", {
    headers: { Authorization: authHeader },
    next: { revalidate: 60 },
  });

  if (!serviceTypesRes.ok) {
    throw new Error(`Failed to fetch service types: ${serviceTypesRes.status} ${serviceTypesRes.statusText}`);
  }

  const serviceTypesJson = await serviceTypesRes.json();
  const serviceTypeIds: string[] = serviceTypesJson?.data.map((item: any) => item.id) ?? [];

  // 2. Try each service type until we find the one that owns this plan
  for (const serviceTypeId of serviceTypeIds) {
    const items = await fetchPlanItems(serviceTypeId, planId, authHeader);
    // null means this service type doesn't own the plan (404) — keep looking.
    if (items === null) {
      continue;
    }

    const attributes = items.map((item: any) => ({
      ...item.attributes,
      ...item.relationships,
    }));

    const enriched = await Promise.all(
      attributes.map(async (item: any) => {
        if (!item?.song?.data?.id) return item;

        const songId = item.song.data.id;
        const response = await fetch(`https://api.planningcenteronline.com/services/v2/songs/${songId}/arrangements`, {
          headers: { Authorization: authHeader },
          next: { revalidate: 60 },
        });

        if (!response.ok) {
          console.error(`Failed to fetch arrangements for song ${songId}: ${response.status}`);
          return item;
        }

        const arrangements = await response.json();
        const arrangement = arrangements.data?.[0]?.attributes;
        const lyrics = arrangement?.lyrics ?? "";
        return {
          ...item,
          lyrics,
          chordChart: arrangement?.chord_chart ?? "",
          html_details: lyrics ? lyricsToHtml(lyrics) : item.html_details,
        };
      })
    );

    return enriched.filter(
      (item: any) =>
        item.title !== "SERVICE" && item.title !== "SHHHH_Slide" && item.title !== "PreService Slide" && item.title !== "Reading Response"
    );
  }

  throw new Error(`Plan ${planId} not found under any service type`);
}

// Fetches every item for a plan under a given service type, following PCO's
// pagination (25 items/page by default, which otherwise drops later sections
// like OFFERTORY and COMMUNION). Returns null if the service type doesn't own
// the plan (404); throws on any other error.
async function fetchPlanItems(serviceTypeId: string, planId: string, authHeader: string): Promise<any[] | null> {
  let nextUrl:
    | string
    | null = `https://api.planningcenteronline.com/services/v2/service_types/${serviceTypeId}/plans/${planId}/items?include=song&per_page=100`;

  const items: any[] = [];
  let isFirstPage = true;

  while (nextUrl) {
    const itemsRes: Response = await fetch(nextUrl, {
      headers: { Authorization: authHeader },
      next: { revalidate: 60 },
    });

    if (!itemsRes.ok) {
      // 404 on the first page just means wrong service type.
      if (isFirstPage && itemsRes.status === 404) {
        return null;
      }
      throw new Error(`Unexpected error fetching plan items: ${itemsRes.status} ${itemsRes.statusText}`);
    }

    const itemsJson: any = await itemsRes.json();
    items.push(...itemsJson.data);
    nextUrl = itemsJson.links?.next ?? null;
    isFirstPage = false;
  }

  return items;
}

export async function getEsvPassage(reference: any, apiKey: any) {
  const params = new URLSearchParams({
    q: reference,
    "include-headings": "false",
    "include-footnotes": "false",
    "include-verse-numbers": "false",
    "include-short-copyright": "false",
    "include-passage-references": "true",
    "include-first-verse-numbers": "false",
    "include-audio-link": "false",
    "wrapping-div": "true",
  });

  const response = await fetch(`https://api.esv.org/v3/passage/html/?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Token ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`ESV API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // A reference can span multiple ranges (e.g. "Rom 8:26-34,38-39"), which the
  // ESV API returns as one array element per range — join them all, not just the first.
  return {
    reference: data.canonical,
    text: (data.passages ?? []).map((passage: string) => passage.trim()).join("\n") || "",
  };
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Converts plain-text song lyrics (from a Planning Center arrangement) into HTML.
// Blank lines separate stanzas; a stanza whose first line is a section label
// (Verse, Chorus, Bridge, etc.) renders that label as a heading. Single line
// breaks within a stanza become <br>.
function lyricsToHtml(lyrics: string): string {
  const sectionLabel = /^(verse|chorus|pre-?chorus|bridge|intro|outro|refrain|tag|interlude|ending|vamp|coda)\b.*$/i;

  return lyrics
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n\s*\n/)
    .map((stanza) => {
      const lines = stanza.split("\n").map((line) => line.trim());
      let heading = "";

      if (lines.length && sectionLabel.test(lines[0])) {
        heading = `<h4 class="lyrics-section">${escapeHtml(lines.shift() as string)}</h4>`;
      }

      const body = lines
        .filter((line) => line.length > 0)
        .map((line) => escapeHtml(line))
        .join("<br />");

      const paragraph = body ? `<p class="lyrics-stanza">${body}</p>` : "";
      return heading + paragraph;
    })
    .filter(Boolean)
    .join("\n");
}

interface PsalmRange {
  chapter: number;
  start?: number; // undefined → whole chapter
  end?: number;
}

// Parses one segment of a psalm reference. A segment either names its own
// chapter ("Psalm 78:1-13", "Psalm 78") or, for a continuation segment, is a
// bare verse range ("14-26") that carries the previous segment's chapter.
// Surrounding noise (book name, stray "v") is ignored.
function parsePsalmSegment(segment: string, currentChapter: number | undefined, isFirst: boolean): PsalmRange | null {
  const colonIndex = segment.indexOf(":");

  if (colonIndex !== -1) {
    const chapterMatch = /(\d+)\s*$/.exec(segment.slice(0, colonIndex));
    const verseMatch = /(\d+)(?:\s*-\s*(\d+))?/.exec(segment.slice(colonIndex + 1));
    if (!chapterMatch || !verseMatch) {
      return null;
    }
    const start = parseInt(verseMatch[1], 10);
    return {
      chapter: parseInt(chapterMatch[1], 10),
      start,
      end: verseMatch[2] ? parseInt(verseMatch[2], 10) : start,
    };
  }

  const range = /(\d+)(?:\s*-\s*(\d+))?/.exec(segment);
  if (!range) {
    return null;
  }

  // First segment with no colon (e.g. "Psalm 78") → the whole chapter.
  if (isFirst) {
    return { chapter: parseInt(range[1], 10) };
  }

  // Continuation range (e.g. "; 14-26") keeps the current chapter.
  if (currentChapter === undefined) {
    return null;
  }
  const start = parseInt(range[1], 10);
  return { chapter: currentChapter, start, end: range[2] ? parseInt(range[2], 10) : start };
}

export async function getPsalter(reference: string) {
  const cleanReference = stripHtml(reference);

  // Supports multiple ranges separated by ";" or ",":
  //   "Psalm 23"              → whole psalm
  //   "Psalm 23:1-6"          → single range
  //   "Ps 78:1-13; 14-26"     → two ranges in the same psalm
  //   "Ps 78:1-13; Ps 79:1-9" → ranges across psalms
  const segments = cleanReference
    .split(/[;,]/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const ranges: PsalmRange[] = [];
  let currentChapter: number | undefined;

  segments.forEach((segment, index) => {
    const parsed = parsePsalmSegment(segment, currentChapter, index === 0);
    if (parsed) {
      currentChapter = parsed.chapter;
      ranges.push(parsed);
    }
  });

  if (!ranges.length) {
    return undefined;
  }

  const response = await fetch("https://api.dailyoffice2019.com/api/v1/psalms");

  if (!response.ok) {
    throw new Error(`Daily Office API error: ${response.status} ${response.statusText}`);
  }

  const data: any[] = await response.json();

  const psalmData = ranges.flatMap((range) => {
    const psalmChapter = data.find((item) => item.number === range.chapter);
    if (!psalmChapter) {
      return [];
    }
    // No verse range → the whole psalm.
    if (range.start === undefined) {
      return psalmChapter.verses;
    }
    const end = range.end ?? range.start;
    return psalmChapter.verses.filter((verse: any) => verse.number >= range.start! && verse.number <= end);
  });

  if (!psalmData.length) {
    return undefined;
  }

  return { psalmData };
}
