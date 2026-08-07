import { NextResponse } from "next/server";
import { churchToday, getDailyOffice, normalizeApiDate } from "@/app/lib/getDailyOffice";

/**
 * Daily Office readings for the homepage widget.
 *
 * Fetched from the browser rather than rendered into the page so the homepage
 * stays statically cached while the card still shows *today's* office.
 *
 *   GET /api/daily-office            → today's citations (small)
 *   GET /api/daily-office?full=1     → today's citations plus the full lesson text
 *   GET /api/daily-office?date=Y-M-D → a specific day
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const today = churchToday();

  const requested = normalizeApiDate(searchParams.get("date"));
  const apiDate = requested ?? today.apiDate;

  // Only "today" has a friendly label to hand; other dates get one built here.
  const dateLabel = requested && requested !== today.apiDate ? formatRequestedDate(requested) : today.label;

  const office = await getDailyOffice(apiDate, dateLabel, searchParams.get("full") === "1");

  if (!office) {
    return NextResponse.json({ error: "Daily Office readings are unavailable right now." }, { status: 503 });
  }

  return NextResponse.json(office, {
    // Readings never change for a given day; let the CDN hold them.
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}

function formatRequestedDate(apiDate: string) {
  const [year, month, day] = apiDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric" }).format(
    new Date(Date.UTC(year, month - 1, day))
  );
}
