// Daily Office readings, pulled live from the same dailyoffice2019.com service
// the site already uses for the liturgical colour (see PrimaryColorContext).
//
// Two upstream endpoints are involved:
//   /api/v1/calendar/<Y-M-D>  — season, liturgical colour, commemorations
//   /api/v1/readings/<Y-M-D>  — Morning/Evening Prayer lessons, with full text
//
// Both are keyed by date and never change once published, so they cache hard.

import { CHURCH_TIME_ZONE, getChurchParts } from "./serviceTime";

const API_ROOT = "https://api.dailyoffice2019.com/api/v1";

// The upstream WAF rejects some default agents (Python's urllib gets a 403),
// so identify ourselves explicitly rather than relying on the runtime default.
const REQUEST_HEADERS = { Accept: "application/json", "User-Agent": "resurrectionrockhill.org (daily office widget)" };

const UPSTREAM_TIMEOUT_MS = 6_000;

/** The two offices we surface. The API also returns commemoration-specific services. */
const OFFICES = [
  { key: "morning", upstreamName: "Morning Prayer", label: "Morning Prayer" },
  { key: "evening", upstreamName: "Evening Prayer", label: "Evening Prayer" },
] as const;

export type OfficeKey = (typeof OFFICES)[number]["key"];

export interface DailyOfficeReading {
  readonly name: string;
  readonly citation: string;
  /** Present only when the caller asked for full text. */
  readonly text?: string;
}

export interface DailyOfficeService {
  readonly key: OfficeKey;
  readonly label: string;
  readonly readings: readonly DailyOfficeReading[];
}

export interface DailyOffice {
  /** ISO date the readings belong to, in the church's timezone. */
  readonly date: string;
  readonly dateLabel: string;
  readonly season: string | null;
  readonly commemoration: string | null;
  readonly services: readonly DailyOfficeService[];
}

/** Today's date in the church's timezone, in the `Y-M-D` shape the API expects. */
export function churchToday(now: Date = new Date()): { apiDate: string; isoDate: string; label: string } {
  const { year, month, day } = getChurchParts(now);
  const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return {
    apiDate: `${year}-${month}-${day}`,
    isoDate: iso,
    label: new Intl.DateTimeFormat("en-US", {
      timeZone: CHURCH_TIME_ZONE,
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(now),
  };
}

/** Accepts `Y-M-D` or `YYYY-MM-DD`; rejects anything else so the path can't be forged. */
export function normalizeApiDate(value: string | null): string | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value);
  if (!match) return null;

  const [, year, month, day] = match;
  if (Number(month) < 1 || Number(month) > 12 || Number(day) < 1 || Number(day) > 31) return null;

  return `${Number(year)}-${Number(month)}-${Number(day)}`;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: REQUEST_HEADERS,
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      // Readings for a past or present date are immutable once published.
      next: { revalidate: 43_200 },
    });

    if (!response.ok) {
      console.error(`Daily Office: ${response.status} from ${url}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`Daily Office: request to ${url} failed`, error);
    return null;
  }
}

interface UpstreamReading {
  name?: string;
  citation?: string;
  text?: string;
  /** "30" or "60" for psalms — the two psalter cycles — and null for lessons. */
  cycle?: string;
  reading_number?: string;
}

interface UpstreamReadingsResponse {
  services?: Record<string, { readings?: Array<{ full?: UpstreamReading; abbreviated?: UpstreamReading }> }>;
}

interface UpstreamCalendarResponse {
  season?: { name?: string };
  commemorations?: Array<{ name?: string; rank?: { name?: string; precedence?: number } }>;
}

const cleanCitation = (citation: string) => citation.replace(/\s+/g, " ").trim();

/**
 * The API offers the psalms twice — once for the 30-day psalter and once for
 * the 60-day — which reads on a card as the same slot listed with two
 * different psalms. Keep the 60-day cycle (the 2019 book's default), falling
 * back to whatever is offered when only one cycle is present.
 */
function dropDuplicatePsalterCycle(readings: readonly UpstreamReading[]): UpstreamReading[] {
  const sixtyDaySlots = new Set(readings.filter((reading) => reading.cycle === "60").map((reading) => reading.reading_number));

  return readings.filter((reading) => !(reading.cycle === "30" && sixtyDaySlots.has(reading.reading_number)));
}

/**
 * A day's Daily Office.
 *
 * `includeText` controls payload size: the summary card only needs citations,
 * and the full lessons run to tens of kilobytes, so they are fetched only when
 * a visitor actually expands the reading.
 */
export async function getDailyOffice(apiDate: string, dateLabel: string, includeText = false): Promise<DailyOffice | null> {
  const [readings, calendar] = await Promise.all([
    fetchJson<UpstreamReadingsResponse>(`${API_ROOT}/readings/${apiDate}`),
    fetchJson<UpstreamCalendarResponse>(`${API_ROOT}/calendar/${apiDate}`),
  ]);

  // The calendar is decoration; without readings there is nothing to show.
  if (!readings?.services) return null;

  const services: DailyOfficeService[] = [];

  for (const office of OFFICES) {
    const upstream = readings.services[office.upstreamName];
    if (!upstream?.readings?.length) continue;

    const offered = upstream.readings
      .map((reading) => reading.full ?? reading.abbreviated)
      .filter((reading): reading is UpstreamReading => Boolean(reading?.citation));

    const mapped = dropDuplicatePsalterCycle(offered).map((reading) => ({
      name: reading.name?.trim() || "Reading",
      citation: cleanCitation(reading.citation as string),
      ...(includeText && reading.text ? { text: reading.text } : {}),
    }));

    if (mapped.length > 0) services.push({ key: office.key, label: office.label, readings: mapped });
  }

  if (services.length === 0) return null;

  // Ordinary weekdays list a generic "Friday after the Nth Sunday…" entry that
  // reads as noise; only a named saint or feast is worth surfacing.
  const feast = calendar?.commemorations?.find((entry) => entry.name && !/^(sun|mon|tues|wednes|thurs|fri|satur)day\b/i.test(entry.name));

  const [year, month, day] = apiDate.split("-").map(Number);

  return {
    date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    dateLabel,
    season: calendar?.season?.name?.trim() || null,
    commemoration: feast?.name?.trim() || null,
    services,
  };
}
