import { Container } from "react-bootstrap";
import HeroImage from "../../components/HeroImage";
import RevealSection from "../../components/RevealSection";
import { buildMetadata } from "../../lib/buildMetadata";
import { getEsvPassage, getPlanningCenterServicesData, getPsalter } from "../../lib/getProPresenterData";
import type { LiturgyPlanSummary } from "../../lib/getProPresenterData";
import LiturgyReader from "../../components/LiturgyReader";
import { SECTION_ATTRIBUTE, HEADING_ATTRIBUTE } from "../../lib/liturgyScroll";
import { buildSectionLabel, markUpSpeakerLabels, slugifyTitle } from "../../lib/liturgyMarkup";
import type { LiturgySection } from "../../lib/liturgyMarkup";
import type { ResolvedServiceDataModel, ServiceDataModel } from "../../models/serviceModel";
import bcp from "@/app/lib/bcp.json";

export const dynamic = "force-dynamic";

// Matches things like: Matt 14:22-33, John 3:16, 1 Cor 13:4-7, Psalm 23, 2 Timothy 3:16-17
// The range separator allows en/em dashes — Planning Center and the ESV API both
// emit "14:22–33", and a hyphen-only class would silently drop the end verse.
const BIBLE_REF_REGEX = /\b((?:[1-3]\s?)?[A-Za-z]+(?:\.|\s)?)\s?(\d{1,3})(?::(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?)?\b/g;

const BIBLE_BOOKS = [
  "genesis",
  "exodus",
  "leviticus",
  "numbers",
  "deuteronomy",
  "joshua",
  "judges",
  "ruth",
  "1samuel",
  "2samuel",
  "1kings",
  "2kings",
  "1chronicles",
  "2chronicles",
  "ezra",
  "nehemiah",
  "esther",
  "job",
  "psalms",
  "proverbs",
  "ecclesiastes",
  "songofsolomon",
  "songofsongs",
  "isaiah",
  "jeremiah",
  "lamentations",
  "ezekiel",
  "daniel",
  "hosea",
  "joel",
  "amos",
  "obadiah",
  "jonah",
  "micah",
  "nahum",
  "habakkuk",
  "zephaniah",
  "haggai",
  "zechariah",
  "malachi",
  "matthew",
  "mark",
  "luke",
  "john",
  "acts",
  "romans",
  "1corinthians",
  "2corinthians",
  "galatians",
  "ephesians",
  "philippians",
  "colossians",
  "1thessalonians",
  "2thessalonians",
  "1timothy",
  "2timothy",
  "titus",
  "philemon",
  "hebrews",
  "james",
  "1peter",
  "2peter",
  "1john",
  "2john",
  "3john",
  "jude",
  "revelation",
];

// Short forms too brief (or too irregular) to resolve as a prefix of a full book name.
const BIBLE_BOOK_ALIASES = new Set([
  "ps",
  "pss",
  "sg",
  "cant",
  "canticles",
  "solomon",
  "jn",
  "1jn",
  "2jn",
  "3jn",
  "mt",
  "mk",
  "lk",
  "jas",
  "phlm",
  "rev",
  "gen",
  "ex",
  "lev",
  "num",
  "dt",
  "josh",
  "jdg",
  "sam",
  "kgs",
  "chr",
]);

// Guards against the regex firing on ordinary prose that happens to read as
// "<Word> <number>" — only real book names count as a reference.
const isBibleBook = (book: string) => {
  const normalized = book.toLowerCase().replace(/[.\s]/g, "");
  if (BIBLE_BOOK_ALIASES.has(normalized)) return true;
  const letters = normalized.replace(/^[1-3]/, "");
  if (letters.length < 3) return false;
  return BIBLE_BOOKS.some((candidate) => candidate.startsWith(normalized));
};

const findBibleReferences = (content: string) => {
  const matches = [...content.matchAll(BIBLE_REF_REGEX)];
  const references = matches
    .filter((m) => isBibleBook(m[1]))
    .map((m) => ({
      // Normalize to a plain hyphen — the ESV reference parser does not accept en dashes.
      full: m[0].trim().replace(/\s*[–—]\s*/g, "-"),
      book: m[1].trim(),
      chapter: m[2],
      verseStart: m[3] || null,
      verseEnd: m[4] || null,
    }));

  // The same reference often appears twice (Celebrant line and "Today's reading"),
  // and ESV would return the passage once per repeat.
  return references.filter((ref, index) => references.findIndex((other) => other.full === ref.full) === index);
};

const setGospelVerses = async (content: string | undefined | null) => {
  if (!content) return content ?? "";

  // The reference lives in the prose, so strip tags before matching or the regex
  // trips over markup instead of the reading.
  const plainText = content.replace(/<[^>]*>/g, " ");
  const references = findBibleReferences(plainText);

  if (references.length === 0) return content;

  // ESV separates multiple passages with ";" — a comma reads as a verse list.
  const wholeVerseReference = references.map((ref) => ref.full).join(";");
  const formattedVerses = await getEsvPassage(wholeVerseReference, process.env.ESV_API_KEY);

  if (!formattedVerses.text) return content;

  // "Matthew 14:22–33" -> "Matthew", so the Celebrant line matches the actual reading.
  const bookName = (formattedVerses.reference ?? "").replace(/\s*\d.*$/, "").trim() || references[0].book;

  return `<div>
              <p>
                <em>Celebrant:</em>&nbsp;The Holy Gospel of our Lord Jesus Christ according to ${bookName}.
              </p>
              <p>
                <em>People:</em>&nbsp;<strong>Glory to you, Lord Christ.</strong>
              </p>
              ${formattedVerses.text}
              <p>
                <em>Celebrant:</em>&nbsp;The Gospel of the Lord.
              </p>
              <p>
                <em>People:</em>&nbsp;<strong>Praise to you, Lord Christ.</strong>
              </p>
            </div>`;
};

const isScriptureReading = (title: string) => title === "NT Reading" || title === "OT Reading" || title.toLowerCase().includes("psalm");

// Planning Center formats `dates` for humans already ("August 9, 2026"), so prefer
// it and only fall back to formatting the raw sort date ourselves.
const formatServiceDate = (plan: LiturgyPlanSummary) => {
  if (plan.dates) return plan.dates;
  if (!plan.sortDate) return null;

  const parsed = new Date(plan.sortDate);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
};

function containsHtml(str: string | undefined | null): boolean {
  if (!str) return false;
  return /<[a-z][\s\S]*>/i.test(str);
}

// One service item's content. Three mutually exclusive shapes: a failed lookup,
// Psalter verses (an array), or HTML/plain text.
function SectionBody({ service }: Readonly<{ service: ResolvedServiceDataModel }>) {
  if (service.readingUnavailable) {
    return (
      <p className="liturgy-reading-unavailable">
        This reading couldn&rsquo;t be loaded right now. Please follow along in your Bible
        {service.referenceText ? <> &mdash; {service.referenceText}</> : null}.
      </p>
    );
  }

  if (Array.isArray(service.resolvedHtml) && service.resolvedHtml.length > 0) {
    return service.resolvedHtml.map((verse: any) => (
      <div key={verse.number} className="psalter-verses">
        <div className="first-half mb-2">{verse.first_half}&#42;</div>
        <div className="second-half fw-bold mb-5 ms-3">{verse.second_half}</div>
      </div>
    ));
  }

  // Songs keep their own typography — the speaker/response treatment is for
  // spoken liturgy, and lyrics have no Celebrant or People to distinguish.
  const bodyClass = service?.item_type === "song" ? "song" : `liturgy-body ${service?.item_type}`;

  return (
    <div>
      {containsHtml(service?.resolvedHtml) ? (
        <div dangerouslySetInnerHTML={{ __html: service?.resolvedHtml }} className={bodyClass} />
      ) : (
        <div className={bodyClass}>{service?.resolvedHtml}</div>
      )}

      {service.title === "OT Reading" || service.title === "NT Reading" ? (
        <div className="liturgy-body">
          <p>
            <span className="liturgy-speaker" data-role="reader">
              Reader
            </span>
            The Word of the Lord.
          </p>
          <p>
            <span className="liturgy-speaker" data-role="people">
              People
            </span>
            <strong>Thanks be to God.</strong>
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default async function Liturgy() {
  const { items, plan } = await getPlanningCenterServicesData();

  const renderBibleVerses = async (verseReference: any, readingType: string) => {
    if (readingType.toLowerCase().includes("psalm") || readingType.toLowerCase().includes("psalms")) {
      const psalterPassage = await getPsalter(verseReference);
      return psalterPassage?.psalmData;
    } else {
      const verseText = verseReference?.replace(/<[^>]*>/g, "");
      const verse = await getEsvPassage(verseText, process.env.ESV_API_KEY);
      return verse.text;
    }
  };

  // Repeated titles ("Hymn", "Song") need an ordinal in the table of contents,
  // or the list reads as several identical entries.
  const titleTotals = new Map<string, number>();
  items.forEach((item: ServiceDataModel) => titleTotals.set(item.title, (titleTotals.get(item.title) ?? 0) + 1));

  const usedSlugs = new Set<string>();
  const titleSeen = new Map<string, number>();

  // Resolve all async verse lookups up front so JSX renders plain strings
  // (a Promise dropped into dangerouslySetInnerHTML renders as "[object Promise]").
  const resolvedServiceData: ResolvedServiceDataModel[] = await Promise.all(
    items.map(async (planningCenter: ServiceDataModel) => {
      const occurrence = (titleSeen.get(planningCenter.title) ?? 0) + 1;
      titleSeen.set(planningCenter.title, occurrence);

      const identity = {
        slug: slugifyTitle(planningCenter.title, usedSlugs),
        label: buildSectionLabel(planningCenter.title, occurrence, titleTotals.get(planningCenter.title) ?? 1),
      };

      let resolvedHtml = planningCenter.html_details;
      let readingUnavailable = false;

      // One bad reference used to take down the whole page: getEsvPassage throws on
      // any non-OK response, and this runs during the service it's meant to support.
      // Isolate each lookup so the rest of the liturgy still renders.
      try {
        if (isScriptureReading(planningCenter.title) && planningCenter?.song?.data?.type !== "Song") {
          const verses = await renderBibleVerses(planningCenter.html_details, planningCenter.title);
          if (verses === undefined || verses === null || (Array.isArray(verses) && verses.length === 0)) {
            readingUnavailable = true;
          } else {
            resolvedHtml = verses;
          }
        } else if (planningCenter.title.toLowerCase() === "gospel") {
          resolvedHtml = markUpSpeakerLabels(await setGospelVerses(planningCenter.html_details));
        } else if (planningCenter?.song?.data?.type !== "Song") {
          if (!planningCenter?.html_details) {
            const matchedBcpItem = bcp.items.find((bcp: any) => bcp.title.toLowerCase() === planningCenter.title.toLowerCase());
            if (matchedBcpItem) {
              resolvedHtml = matchedBcpItem.html;
            }
          }
          resolvedHtml = markUpSpeakerLabels(resolvedHtml);
        }
      } catch (error) {
        console.error(`Liturgy: failed to resolve "${planningCenter.title}"`, error);
        readingUnavailable = true;
      }

      return {
        ...planningCenter,
        ...identity,
        resolvedHtml,
        readingUnavailable,
        referenceText: readingUnavailable ? planningCenter.html_details?.replace(/<[^>]*>/g, "").trim() : undefined,
      };
    })
  );

  const sections: LiturgySection[] = resolvedServiceData.map(({ slug, title, label }) => ({ slug, title, label }));
  const serviceDate = plan ? formatServiceDate(plan) : null;
  const serviceSeason = plan?.seriesTitle || plan?.title || null;

  return (
    <div className="liturgy-container">
      <LiturgyReader sections={sections} planId={plan?.id ?? null} />
      <HeroImage image="/images/pages/jesus-resurrection.jpg">{"Liturgy"}</HeroImage>

      {serviceSeason || serviceDate ? (
        <div className="liturgy-service-header">
          <Container>
            {serviceSeason ? <span className="liturgy-service-season">{serviceSeason}</span> : null}
            {serviceSeason && serviceDate ? <span className="liturgy-service-separator">&middot;</span> : null}
            {serviceDate ? <span className="liturgy-service-date">{serviceDate}</span> : null}
          </Container>
        </div>
      ) : null}
      <div>
        <RevealSection id="liturgyContent" image="/images/pages/art.webp" opacity={0.04}>
          <Container className="pt-5 pb-5">
            {resolvedServiceData.length > 0 ? (
              resolvedServiceData.map((service) => {
                return (
                  <div key={service.sequence} id={service.slug} {...{ [SECTION_ATTRIBUTE]: "" }} className="service-data-container">
                    <h2 tabIndex={-1} {...{ [HEADING_ATTRIBUTE]: "" }}>
                      {service.title}
                    </h2>
                    {service.title === "Psalm Reading" ? (
                      <>
                        <div className="psalm-reference mt-4 mb-4" dangerouslySetInnerHTML={{ __html: service.html_details }} />
                        <hr className="mb-5 mt-5" style={{ width: "50px" }} />
                      </>
                    ) : null}
                    <SectionBody service={service} />
                    <hr className="liturgy-line-break" />
                  </div>
                );
              })
            ) : (
              <div className="liturgy-empty-state">
                <h2>This Sunday&rsquo;s liturgy isn&rsquo;t posted yet.</h2>
                <p>
                  The order of service is published before each Sunday. Please check back, or join us in person &mdash; you&rsquo;ll find a printed
                  copy waiting for you.
                </p>
              </div>
            )}
          </Container>
        </RevealSection>
      </div>
    </div>
  );
}

export async function generateMetadata() {
  return buildMetadata({
    title: "Liturgy",
    excerpt: "Follow along with the current Sunday service liturgy.",
    image: "/images/pages/jesus-resurrection.jpg",
    path: "/liturgy",
  });
}
