// Helpers for turning Planning Center / BCP liturgy HTML into markup the
// liturgy page can navigate and style. Pure functions, safe on the server.

// One entry per section of the service, in order. Deliberately light — this is
// what gets serialized to the client for the table of contents and the reader
// controls, so it must not carry the liturgy HTML with it.
export interface LiturgySection {
  slug: string;
  title: string;
  label: string;
}

// Speaker roles that appear as an <em> label in bcp.json. Anything else inside
// an <em> is a rubric (an instruction to the celebrant), not something to say.
const SPEAKER_ROLES: Record<string, string> = {
  celebrant: "Celebrant",
  people: "People",
  reader: "Reader",
  deacon: "Deacon",
  priest: "Priest",
  bishop: "Bishop",
  leader: "Leader",
  officiant: "Officiant",
  all: "All",
};

// Captures an <em> plus any colon and trailing space that follows it, because a
// speaker label is rendered as its own block and must not leave a stray ": " behind.
// The colon shows up on both sides of the closing tag in the real content:
//   <em>Celebrant:</em>&nbsp;Almighty God...   (Confession)
//   <em>Celebrant</em>: Blessed be God...      (Opening Acclamation)
const EM_WITH_TRAILING_PUNCTUATION = /<em>([\s\S]*?)<\/em>(\s*:)?((?:&nbsp;|\s)*)/gi;

const asRoleKey = (text: string) =>
  text
    .replace(/&nbsp;/gi, " ")
    .replace(/[:\s]+$/g, "")
    .trim()
    .toLowerCase();

/**
 * Rewrites speaker labels into `<span class="liturgy-speaker">` so the label can
 * be de-emphasized and the words themselves given prominence.
 *
 * Every other `<em>` is returned byte-for-byte unchanged. That matters: `<em>`
 * also carries rubrics ("The Celebrant may then say...") and emphasis inside
 * scripture, and mislabelling either would be worse than leaving it alone.
 *
 * The emitted role text comes from SPEAKER_ROLES rather than from the matched
 * content, so no new untrusted HTML is introduced here.
 *
 * Not applied to song lyrics or Psalter verses — neither uses speaker labels,
 * and both have their own typography.
 */
export function markUpSpeakerLabels(html: string | null | undefined): string {
  if (!html) return "";

  return html.replace(EM_WITH_TRAILING_PUNCTUATION, (match, inner: string) => {
    const key = asRoleKey(inner);
    const role = SPEAKER_ROLES[key];

    if (!role) return match;

    return `<span class="liturgy-speaker" data-role="${key}">${role}</span>`;
  });
}

/**
 * Builds a stable, shareable section id from a service item title, so a link
 * like /liturgy#confession keeps working even when Planning Center reorders the
 * plan. `used` is mutated to track collisions — plans routinely repeat titles
 * like "Hymn", which would otherwise produce duplicate DOM ids.
 */
export function slugifyTitle(title: string | null | undefined, used: Set<string>): string {
  const base =
    (title ?? "")
      .toLowerCase()
      .replace(/&[a-z]+;/gi, " ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-+)|(-+$)/g, "") || "section";

  let slug = base;
  let suffix = 2;
  while (used.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  used.add(slug);
  return slug;
}

/**
 * Table-of-contents labels. Planning Center relationships give us a song id but
 * not the song name, so repeated titles are disambiguated by ordinal ("Hymn (2)")
 * rather than left ambiguous in the list.
 */
export function buildSectionLabel(title: string, occurrence: number, totalOccurrences: number): string {
  return totalOccurrences > 1 ? `${title} (${occurrence})` : title;
}