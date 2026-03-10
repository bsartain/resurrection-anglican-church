"use client";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { Container } from "react-bootstrap";
import Link from "next/link";

import CoffeeDateButton from "./CoffeeDateButton";
import TestimonialCarousel from "./TestimonialCarousel";
import { DocumentElement } from "@keystatic/core";
import RevealSection from "./RevealSection";

// ────────────────────────────────────────────────
// Types (only defined once)
interface SectionWithContent {
  title: string;
  buttonPageLink: string;
  buttonText: string;
  images: readonly string[];
  content: DocumentElement[];
}

interface Section2WithContent {
  title: string;
  buttonPageLink: string;
  buttonText: string;
  image: string;
  content: DocumentElement[];
  images?: readonly string[];
}

interface Section6 {
  title: string;
  buttonPageLink: string;
  buttonText: string;
  testimonials: readonly Testimonials[];
}

interface Testimonials {
  name: string;
  testimonial: string;
}

interface Props {
  section1: SectionWithContent;
  section2: Section2WithContent;
  section3: Section2WithContent;
  section4: Section2WithContent;
  section5: SectionWithContent;
  section6: Section6;
  section7: Section2WithContent;
}

export default function HomeSections({ section1, section2, section3, section4, section5, section6, section7 }: Props) {
  const sectionOneImageCaption = (index: number) => {
    if (index === 0) return "Experience the Trinity";
    if (index === 1) return "Embody Community";
    if (index === 2) return "Engage the City";
    return "";
  };

  return (
    <>
      <div>
        <RevealSection
          id="come-worship"
          className="home-section dark-background-home-section"
          image="/images/pages/icon-resurrection.jpg"
          opacity={0.02}
        >
          <div className="worship-two-col">
            <div className="worship-left">
              <h2 className="mb-4">Come Worship With Us</h2>
              <div className="worship-service-block">
                <p className="worship-label">Service Times</p>
                <p className="worship-time">Sundays at 4:00 PM</p>
              </div>
              <div className="worship-service-block">
                <p className="worship-label">Address</p>
                <p className="worship-time">18225 Eden Terrace, Rock Hill, SC 29730</p>
              </div>
              <div className="worship-childcare-block">
                <p className="worship-label">Children&apos;s Ministry</p>
                <p>
                  We offer nursery and children&apos;s church where there are age-appropriate lessons and activities for preschool–5th grade. This
                  takes place during the scripture reading and sermon.
                </p>
              </div>
              <Link
                className="btn btn-lg btn-primary mt-2 rounded"
                href="/plan-your-visit"
                style={{ background: "#ffffff", color: "#2b2b2b", fontSize: "25px" }}
              >
                Plan Your Visit
              </Link>
            </div>
            <div className="worship-right">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3269.973542741285!2d-81.0047756!3d34.9572718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88568c74b4684edd%3A0xd0c91ab7c5b8691d!2sResurrection%20Anglican%20Church!5e0!3m2!1sen!2sus!4v1773174932691!5m2!1sen!2sus"
                width="100%"
                height="450"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </RevealSection>
        {/* Welcome / Section 1 */}
        <RevealSection id="welcome" className="home-section" image="/images/pages/art.webp">
          <Container>
            <h1 className="mb-3">{section1.title}</h1>
            <div className="mb-5">
              <DocumentRenderer document={section1.content} />
            </div>

            <div className="service-info">
              {section1.images.length > 0 ? (
                section1.images.map((image, index) => (
                  <div key={index} className="service-info-images" style={{ backgroundImage: `url("${image}")` }}>
                    <div className="overlay" />
                    <div className="tagline">{sectionOneImageCaption(index)}</div>
                  </div>
                ))
              ) : (
                <>
                  <div className="service-info-images" style={{ backgroundImage: `url("/images/home-page/liturgy.jpg")` }}>
                    <div className="overlay" />
                    <div className="tagline">Experience the Trinity</div>
                  </div>
                  <div className="service-info-images" style={{ backgroundImage: `url("/images/home-page/fellowship-meal.jpg")` }}>
                    <div className="overlay" />
                    <div className="tagline">Embody Community</div>
                  </div>
                  <div className="service-info-images" style={{ backgroundImage: `url("/images/home-page/outreach.jpg")` }}>
                    <div className="overlay" />
                    <div className="tagline">Engage the City</div>
                  </div>
                </>
              )}
            </div>
          </Container>
        </RevealSection>

        {/* Story / Section 2 */}
        <RevealSection id="story-2" className="home-section dark-background-home-section" image="/images/pages/icon-resurrection.jpg" opacity={0.02}>
          <Container>
            <div className="story-container">
              <div className="story-image rounded mb-3" style={{ backgroundImage: `url("${section2.image}")` }} />
              <div>
                <h2>{section2.title}</h2>
                <DocumentRenderer document={section2.content} />
                <CoffeeDateButton />
              </div>
            </div>
          </Container>
        </RevealSection>

        {/* Story / Section 3 */}
        <RevealSection id="story-3" className="home-section" image="/images/pages/jesus-cross.jpg" opacity={0.03}>
          <Container>
            <div className="story-container">
              <div>
                <h2 className="mb-3">{section3.title}</h2>
                <DocumentRenderer document={section3.content} />
                <h3 className="mb-3 mt-5">Daily Bible Readings</h3>
                <p>
                  <em>The Daily Office</em>, our Anglican plan for daily Bible reading, has been around for centuries, and is a spiritual practice to
                  help us center each day in the presence of God as we read the Bible.
                </p>
                <Link href="https://www.dailyoffice2019.com/" target="_blank" className="btn btn-primary-light btn-lg mb-5">
                  Read
                </Link>
              </div>
              <div className="grid-section-images">
                <div className="top-section-image-container">
                  <div
                    className="top-section-image rounded me-3"
                    style={{ backgroundImage: `url(${section3?.images?.[0] ?? "/images/pages/altar-girl.jpg"})` }}
                  ></div>
                  <div
                    className="top-section-image rounded"
                    style={{ backgroundImage: `url(${section3?.images?.[1] ?? "/images/pages/altar-girl.jpg"})` }}
                  ></div>
                </div>
                <div
                  className="bottom-section-image rounded mt-3"
                  style={{ backgroundImage: `url(${section3?.images?.[2] ?? "/images/pages/altar-girl.jpg"})` }}
                ></div>
              </div>
            </div>
          </Container>
        </RevealSection>

        {/* Story / Section 4 */}
        <RevealSection id="story-4" className="home-section dark-background-home-section" image="/images/pages/icon-resurrection.jpg" opacity={0.02}>
          <Container>
            <div className="story-container">
              {/* <div className="story-image rounded mb-5" style={{ backgroundImage: `url("${section4.image}")` }} /> */}
              <div className="grid-section-images">
                <div className="top-section-image-container">
                  <div
                    className="top-section-image rounded me-3"
                    style={{ backgroundImage: `url(${section4?.images?.[0] ?? "/images/pages/altar-girl.jpg"})` }}
                  ></div>
                  <div
                    className="top-section-image rounded"
                    style={{ backgroundImage: `url(${section4?.images?.[1] ?? "/images/pages/altar-girl.jpg"})` }}
                  ></div>
                </div>
                <div
                  className="bottom-section-image rounded mt-3"
                  style={{ backgroundImage: `url(${section4?.images?.[2] ?? "/images/pages/altar-girl.jpg"})` }}
                ></div>
              </div>
              <div>
                <h2>{section4.title}</h2>
                <DocumentRenderer document={section4.content} />
              </div>
            </div>
          </Container>
        </RevealSection>

        {/* Welcome / Section 5 (Kids?) */}
        <RevealSection id="welcome-5" className="home-section" image="/images/pages/icon-resurrection.jpg" opacity={0.01}>
          <Container>
            <h1>{section5.title}</h1>
            <DocumentRenderer document={section5.content} />

            {section5.buttonPageLink && section5.buttonText && (
              <Link href={section5.buttonPageLink} className="btn btn-primary-light btn-lg mb-5">
                {section5.buttonText}
              </Link>
            )}

            <div className="service-info">
              {section5.images.length > 0 ? (
                section5.images.map((image, index) => (
                  <div key={index} className="service-info-images" style={{ backgroundImage: `url("${image}")` }} />
                ))
              ) : (
                <>
                  <div className="service-info-images" style={{ backgroundImage: `url("/images/home-page/children1.jpeg")` }} />
                  <div className="service-info-images" style={{ backgroundImage: `url("/images/home-page/children2.jpeg")` }} />
                  <div className="service-info-images" style={{ backgroundImage: `url("/images/home-page/children3.jpeg")` }} />
                </>
              )}
            </div>
          </Container>
        </RevealSection>

        {/* Testimonials / Section 6 */}
        <RevealSection id="testimonials" className="home-section dark-background-home-section">
          <Container>
            <TestimonialCarousel testimonials={section6.testimonials} />
          </Container>
        </RevealSection>

        {/* Anglican Way / Section 7 */}
        <RevealSection id="anglican-way" className="home-section" image="/images/pages/icon-resurrection.jpg" opacity={0.03}>
          <Container>
            <div className="story-container">
              <div>
                <h2>{section7.title}</h2>
                <DocumentRenderer document={section7.content} />

                {section7.buttonPageLink && section7.buttonText && (
                  <Link href={section7.buttonPageLink} className="btn btn-primary-light btn-lg mb-5">
                    {section7.buttonText}
                  </Link>
                )}
              </div>

              <div className="story-image rounded" style={{ backgroundImage: `url("${section7.image}")` }} />
            </div>
          </Container>
        </RevealSection>

        {/* Final quote */}
        <RevealSection id="quote" className="home-section dark-background-home-section">
          <Container>
            <h1 className="decorative-quote">
              Glory be to the Father, and to the Son, and to the Holy Spirit; as it was in the beginning, is now, and ever shall be, world without
              end.
              <br />
              Amen.
            </h1>
          </Container>
        </RevealSection>
      </div>
    </>
  );
}
