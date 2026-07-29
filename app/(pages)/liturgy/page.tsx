import { Container } from "react-bootstrap";
import HeroImage from "../../components/HeroImage";
import RevealSection from "../../components/RevealSection";
import { buildMetadata } from "../../lib/buildMetadata";
import { getProPresenterData } from "../../lib/getProPresenterData";
import { ProPresenterSlide } from "../../models/proPresenterModel";

export const dynamic = "force-dynamic";

export default async function Liturgy() {
  const data = await getProPresenterData();
  const presentation = data?.presentation;
  const slideGroups = presentation?.presentationSlideGroups ?? [];

  return (
    <div className="liturgy-container">
      <HeroImage image="/images/home/section4/images/0.jpg">{presentation?.presentationsummary ?? "Liturgy"}</HeroImage>
      <div>
        <RevealSection id="liturgyContent" image="/images/pages/art.webp" opacity={0.04}>
          <Container className="pt-5 pb-5 reveal">
            {slideGroups.length > 0 ? (
              slideGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="liturgy-group mb-5">
                  {group.groupsummary ? <h2 className="mb-4">{group.groupsummary}</h2> : null}
                  {group.groupSlides
                    .filter((slide) => slide.slideEnabled)
                    .map((slide: ProPresenterSlide, slideIndex: number) => (
                      <div key={slideIndex} className="liturgy-slide mb-4">
                        {slide.slideLabel ? <h5 className="text-uppercase text-muted">{slide.slideLabel}</h5> : null}
                        {slide.slideText.split("\n").map((line, lineIndex) => (
                          <p key={lineIndex} className="mb-1">
                            {line}
                          </p>
                        ))}
                      </div>
                    ))}
                </div>
              ))
            ) : (
              <p>No liturgy is currently being presented.</p>
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
    image: "/images/pages/jesus-cross.jpg",
    path: "/liturgy",
  });
}
