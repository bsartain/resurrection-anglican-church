import { Container } from "react-bootstrap";
import HeroImage from "../../components/HeroImage";
import RevealSection from "../../components/RevealSection";
import { buildMetadata } from "../../lib/buildMetadata";
import { getEsvPassage, getPlanningCenterServicesData, getPsalter } from "../../lib/getProPresenterData";
import LiturgyDrawerSync from "../../components/LiturgyDrawerSync";
import type { ServiceDataModel } from "../../models/serviceModel";
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
                <em>Celebrant:</em>&nbsp;The Holy Gospel of our Lord Jesus Christ according to ${bookName}.<br><br>
                <em>People:</em>&nbsp;<strong>Glory to you, Lord Christ.</strong>
              </p>
              ${formattedVerses.text}
              <p><br>
                <em>Celebrant:</em>&nbsp;The Gospel of the Lord.<br>
                <em>People:</em> <strong>Praise to you, Lord Christ.</strong>
              </p>
            </div>`;
};

export default async function Liturgy() {
  const serviceData = await getPlanningCenterServicesData();

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

  // Resolve all async verse lookups up front so JSX renders plain strings
  // (a Promise dropped into dangerouslySetInnerHTML renders as "[object Promise]").
  const resolvedServiceData = await Promise.all(
    serviceData.map(async (planningCenter: ServiceDataModel) => {
      let resolvedHtml = planningCenter.html_details;

      if (
        planningCenter.title === "NT Reading" ||
        planningCenter.title === "OT Reading" ||
        (planningCenter.title.toLowerCase().includes("psalm") && planningCenter?.song?.data?.type !== "Song")
      ) {
        resolvedHtml = await renderBibleVerses(planningCenter.html_details, planningCenter.title);
      } else if (planningCenter.title.toLowerCase() === "gospel") {
        resolvedHtml = await setGospelVerses(planningCenter.html_details);
      } else if (planningCenter?.song?.data?.type !== "Song") {
        if (!planningCenter?.html_details) {
          const matchedBcpItem = bcp.items.find((bcp: any) => bcp.title.toLowerCase() === planningCenter.title.toLowerCase());
          if (matchedBcpItem) {
            resolvedHtml = matchedBcpItem.html;
          }
        }
      }

      return {
        ...planningCenter,
        resolvedHtml,
      };
    })
  );

  function containsHtml(str: string | undefined | null): boolean {
    if (!str) return false;
    return /<[a-z][\s\S]*>/i.test(str);
  }

  return (
    <div className="liturgy-container">
      <LiturgyDrawerSync data={resolvedServiceData} />
      <HeroImage image="/images/pages/jesus-resurrection.jpg">{"Liturgy"}</HeroImage>
      <div>
        <RevealSection id="liturgyContent" image="/images/pages/art.webp" opacity={0.04}>
          <Container className="pt-5 pb-5 reveal">
            {resolvedServiceData.length > 0
              ? resolvedServiceData.map((service) => {
                  return (
                    <div key={service.sequence} id={`liturgy-section-${service.sequence}`} className="service-data-container">
                      <h2>{service.title}</h2>
                      {service.title === "Psalm Reading" ? (
                        <>
                          <h3 dangerouslySetInnerHTML={{ __html: service.html_details }} className="mt-4 mb-4" />
                          <hr className="mb-5 mt-5" style={{ width: "50px" }} />
                        </>
                      ) : null}
                      {Array.isArray(service.resolvedHtml) && service.resolvedHtml.length > 0 ? (
                        service.resolvedHtml.map((verse: any) => {
                          return (
                            <div key={verse.number} className="psalter-verses">
                              <div className="first-half mb-2">{verse.first_half}&#42;</div>
                              <div className="second-half fw-bold mb-5 ms-3">{verse.second_half}</div>
                            </div>
                          );
                        })
                      ) : (
                        <div>
                          {containsHtml(service?.resolvedHtml) ? (
                            <div dangerouslySetInnerHTML={{ __html: service?.resolvedHtml }} className={`${service?.item_type}`} />
                          ) : (
                            <div className={`${service?.item_type}`}>{service?.resolvedHtml}</div>
                          )}

                          {service.title === "OT Reading" || service.title === "NT Reading" ? (
                            <div>
                              <div>The Word of the Lord</div>
                              <div>
                                <strong>Thanks be to God.</strong>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}
                      <hr className="liturgy-line-break" />
                    </div>
                  );
                })
              : null}
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
