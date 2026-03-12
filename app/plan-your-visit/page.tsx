import HeroImage from "../components/HeroImage";
import RevealSection from "../components/RevealSection";
import VisitFAQ from "../components/VisitFAQ";
import { Container } from "react-bootstrap";
import { buildMetadata } from "../lib/buildMetadata";
import PlanVisitContactForm from "../components/PlanVisitContactForm";

export default function PlanYourVisit() {
  const bulletPoints: string[] = [
    "Meet you at the front door",
    "Introduce you to the team and some members",
    "Help you get your kids checked in to the children's program",
    "Give you a free gift bag",
  ];
  return (
    <div className="plan-your-visit-container">
      <HeroImage image="/images/friends.jpg">Plan Your Visit</HeroImage>

      {/* Welcome */}
      <RevealSection id="planWelcome" image="/images/pages/jesus-cross.jpg" opacity={0.02}>
        <Container className="pt-5 pb-5 reveal plan-visit-top-content">
          <h2>We&apos;re excited to meet you.</h2>
          <div>
            <p>
              First time at Resurrection Anglican Church? Don&apos;t want to go alone? Or maybe you&apos;ve been a few times but you&apos;d like to
              ask a few questions or connect with some staff and leaders?
            </p>
            <p className="fw-bold">Plan your visit now and we can:</p>
            <ul>
              {bulletPoints.map((point, index) => (
                <li key={index} className="mt-3">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </RevealSection>

      {/* Let us know you're coming */}
      <RevealSection id="planForm" image="/images/pages/jesus-cross.jpg" opacity={0.02} className="dark-background-home-section">
        <Container className="pt-5 pb-5 reveal">
          <h2 className="text-center mb-2">Let Us Know You&apos;re Coming</h2>
          <p className="text-center mb-5">We&apos;ll have someone at the door to welcome you by name.</p>
          <PlanVisitContactForm />
        </Container>
      </RevealSection>

      {/* What to Expect FAQ */}
      <RevealSection id="planExpect" image="/images/pages/jesus-cross.jpg" opacity={0.02}>
        <Container className="pt-5 pb-5 reveal">
          <h2 className="text-center mb-5">What to Expect</h2>
          <VisitFAQ />
        </Container>
      </RevealSection>

      {/* Location */}
      <div className="plan-your-visit">
        <div className="plan-your-visit__content">
          <div className="info">
            <h2>Find Us</h2>
            <hr />
            <div className="info-row">
              <i className="bi bi-clock" />
              <span>Sundays at 4:00 PM</span>
            </div>
            <div className="info-row">
              <i className="bi bi-geo-alt" />
              <span>
                18225 Eden Terrace
                <br />
                Rock Hill, SC 29730
              </span>
            </div>
            <div className="info-row">
              <i className="bi bi-telephone" />
              <a href="tel:+14236536920">(423) 653-6920</a>
            </div>
          </div>
        </div>
        <div className="plan-your-visit__map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6013.7614193179925!2d-81.00917801478182!3d34.957301285619565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88568c74b4684edd%3A0xd0c91ab7c5b8691d!2sResurrection%20Anglican%20Church!5e0!3m2!1sen!2sus!4v1771712896530!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0, display: "block", minHeight: "450px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Resurrection Anglican Church location"
          />
        </div>
      </div>
    </div>
  );
}

export function generateMetadata() {
  return buildMetadata({
    title: "Plan Your Visit | Resurrection Anglican Church",
    excerpt:
      "Join us Sundays at 4:00 PM in Rock Hill, SC. Find service times, directions, children's ministry info, and answers to common questions.",
    image: "/images/pages/contact/image.jpg",
    path: "/plan-your-visit",
  });
}
