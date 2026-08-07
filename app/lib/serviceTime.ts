// Service-time math for the "next service" countdown.
//
// Everything here is anchored to the church's own timezone, not the visitor's:
// a visitor in Seattle should still be told the service is at 4:00 PM Eastern,
// and "in 2 days" has to be measured from the real instant that service starts.

export const CHURCH_TIME_ZONE = "America/New_York";

// The 4:00 PM liturgy runs about 75 minutes (see the "How long is the service?"
// FAQ) — used so the widget reads "Happening now" instead of jumping a week
// ahead the moment the service begins.
export const SERVICE_DURATION_MINUTES = 75;

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

const WEEKDAY_PATTERNS: ReadonlyArray<readonly [RegExp, number]> = [
  [/\bsun(day)?s?\b/i, 0],
  [/\bmon(day)?s?\b/i, 1],
  [/\btue(s|sday)?s?\b/i, 2],
  [/\bwed(nesday)?s?\b/i, 3],
  [/\bthu(r|rs|rsday)?s?\b/i, 4],
  [/\bfri(day)?s?\b/i, 5],
  [/\bsat(urday)?s?\b/i, 6],
];

export interface ServiceSchedule {
  /** 0 = Sunday, matching Date#getDay. */
  readonly weekday: number;
  readonly hour: number;
  readonly minute: number;
  /** Human label, e.g. "Sunday at 4:00 PM". */
  readonly label: string;
}

export const DEFAULT_SCHEDULE: ServiceSchedule = { weekday: 0, hour: 16, minute: 0, label: "Sunday at 4:00 PM" };

const formatClockLabel = (weekday: number, hour: number, minute: number) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${WEEKDAY_NAMES[weekday]} at ${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
};

/**
 * Reads the Keystatic `serviceTime` string ("Sundays at 4:00 PM") so the
 * countdown follows the CMS instead of a hardcoded time. Anything unparseable
 * falls back to the current Sunday 4:00 PM schedule.
 */
export function parseServiceTime(serviceTime?: string | null): ServiceSchedule {
  if (!serviceTime) return DEFAULT_SCHEDULE;

  const weekdayMatch = WEEKDAY_PATTERNS.find(([pattern]) => pattern.test(serviceTime));
  const timeMatch = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(serviceTime);

  if (!weekdayMatch || !timeMatch) return DEFAULT_SCHEDULE;

  const weekday = weekdayMatch[1];
  const minute = Number(timeMatch[2] ?? 0);
  const meridiem = timeMatch[3].toLowerCase();
  let hour = Number(timeMatch[1]) % 12;
  if (meridiem === "pm") hour += 12;

  if (!Number.isFinite(hour) || !Number.isFinite(minute) || hour > 23 || minute > 59) return DEFAULT_SCHEDULE;

  return { weekday, hour, minute, label: formatClockLabel(weekday, hour, minute) };
}

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number;
}

const PART_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: CHURCH_TIME_ZONE,
  hour12: false,
  weekday: "short",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const SHORT_WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** The church-timezone wall-clock reading of an absolute instant. */
export function getChurchParts(date: Date): ZonedParts {
  const parts: Record<string, string> = {};
  for (const part of PART_FORMATTER.formatToParts(date)) {
    if (part.type !== "literal") parts[part.type] = part.value;
  }

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    // Intl renders midnight as "24" in some engines under hour12: false.
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: SHORT_WEEKDAY_INDEX[parts.weekday] ?? 0,
  };
}

/** Milliseconds the church timezone is ahead of UTC at a given instant. */
function churchOffset(date: Date): number {
  const parts = getChurchParts(date);
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  // Drop sub-second precision on both sides so the difference is a clean offset.
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/**
 * Converts a church-timezone wall-clock time to an absolute instant.
 * Day/month values may overflow (day 33, month 13) — Date.UTC normalizes them.
 */
export function churchTimeToInstant(year: number, month: number, day: number, hour: number, minute: number): Date {
  const naive = Date.UTC(year, month - 1, day, hour, minute);
  // First guess uses the offset in force *now-ish*; if the target lands on the
  // other side of a DST boundary the second pass corrects it.
  const firstPass = naive - churchOffset(new Date(naive));
  const secondOffset = churchOffset(new Date(firstPass));
  return new Date(naive - secondOffset);
}

export interface ServiceOccurrence {
  readonly start: Date;
  readonly end: Date;
  readonly inProgress: boolean;
}

/**
 * The service that is either happening right now or is next to happen.
 * A service stays "current" until it ends, so the countdown doesn't skip a
 * week the second the liturgy starts.
 */
export function nextServiceOccurrence(now: Date, schedule: ServiceSchedule, durationMinutes = SERVICE_DURATION_MINUTES): ServiceOccurrence {
  const today = getChurchParts(now);

  // Today, then the same weekday next week — one of the two always ends in the future.
  for (const offset of [(schedule.weekday - today.weekday + 7) % 7, ((schedule.weekday - today.weekday + 7) % 7) + 7]) {
    const start = churchTimeToInstant(today.year, today.month, today.day + offset, schedule.hour, schedule.minute);
    const end = new Date(start.getTime() + durationMinutes * 60_000);
    if (end.getTime() > now.getTime()) {
      return { start, end, inProgress: now.getTime() >= start.getTime() };
    }
  }

  // Unreachable: the +7 candidate is always in the future.
  const start = churchTimeToInstant(today.year, today.month, today.day + 7, schedule.hour, schedule.minute);
  return { start, end: new Date(start.getTime() + durationMinutes * 60_000), inProgress: false };
}

export interface CountdownParts {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly totalMs: number;
}

export function countdownTo(target: Date, now: Date): CountdownParts {
  const totalMs = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(totalMs / 1000);

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    totalMs,
  };
}

/** "in 2 days", "in 3 hours", "in 12 minutes" — the plain-language summary line. */
export function describeCountdown({ days, hours, minutes, seconds }: CountdownParts): string {
  if (days > 0) return `in ${days} ${days === 1 ? "day" : "days"}${hours > 0 ? `, ${hours} ${hours === 1 ? "hour" : "hours"}` : ""}`;
  if (hours > 0) return `in ${hours} ${hours === 1 ? "hour" : "hours"}${minutes > 0 ? `, ${minutes} min` : ""}`;
  if (minutes > 0) return `in ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  return `in ${seconds} ${seconds === 1 ? "second" : "seconds"}`;
}
