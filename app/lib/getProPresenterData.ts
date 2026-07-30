import { ProPresenterData } from "../models/proPresenterModel";

export async function getProPresenterData(): Promise<ProPresenterData> {
  const url = "https://church-liturgy-default-rtdb.firebaseio.com/.json";

  const res = await fetch(url, { next: { revalidate: 60 } }); // Optional: Cache/revalidate every 60 seconds
  if (!res.ok) {
    throw new Error("Failed to fetch liturgy data");
  }

  return res.json();
}

export async function getPlanningCenterServicesData(planId: string = "88692794") {
  const appId = process.env.PCO_APP_ID;
  const secret = process.env.PCO_SECRET;

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

    const attributes = items.map((item: any) => item.attributes);
    return attributes.filter(
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

  return {
    reference: data.canonical,
    text: data.passages[0]?.trim() ?? "",
  };
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

export async function getPsalter(reference: string) {
  const cleanReference = stripHtml(reference);
  const match = cleanReference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);

  if (!match) {
    return undefined;
  }

  const [, , chapterStr, verseStartStr, verseEndStr] = match;
  const chapter = parseInt(chapterStr, 10);
  const verseStart = parseInt(verseStartStr, 10);
  const verseEnd = verseEndStr ? parseInt(verseEndStr, 10) : verseStart;

  const response = await fetch("https://api.dailyoffice2019.com/api/v1/psalms");

  if (!response.ok) {
    throw new Error(`Daily Office API error: ${response.status} ${response.statusText}`);
  }

  const data: any[] = await response.json();

  const psalmChapter = data.find((item) => item.number === chapter);

  if (!psalmChapter) {
    return undefined;
  }

  const psalmData = psalmChapter.verses.filter((verse: any) => verse.number >= verseStart && verse.number <= verseEnd);

  return { psalmData };
}
