import HeroVideo from "./components/HeroVideo";
import { getHomePageData } from "./api/keystatic/lib/keystatic";
import HomeSections from "./components/HomeSections";
import { DocumentElement } from "@keystatic/core";

export interface HomePageData {
  section1: Section1;
  section2: Section2;
  section3: Section2;
  section4: Section2;
  section5: Section1;
  section6: Section6;
  section7: Section2;
}

interface Section6 {
  title: string;
  buttonPageLink: string;
  buttonText: string;
  testimonials: readonly Testimonial[];
}

interface Testimonial {
  readonly name: string;
  readonly testimonial: string;
}

interface Section2 {
  readonly title: string;
  readonly buttonPageLink: string;
  readonly buttonText: string;
  readonly image: string;
  readonly description: () => Promise<DocumentElement[]>;
}

interface Section1 {
  readonly title: string;
  readonly buttonPageLink: string;
  readonly buttonText: string;
  readonly images: readonly string[];
  readonly description: () => Promise<DocumentElement[]>;
}

export default async function Home() {
  const homePageData = await getHomePageData();

  if (!homePageData) {
    return <div>Page data not found.</div>;
  }

  const { section1, section2, section3, section4, section5, section6, section7 } = homePageData;

  return (
    <div>
      <HeroVideo />
      <HomeSections
        section1={{
          title: section1.title,
          buttonPageLink: section1.buttonPageLink,
          buttonText: section1.buttonText,
          images: section1.images,
          content: await section1.description(),
        }}
        section2={{
          title: section2.title,
          buttonPageLink: section2.buttonPageLink,
          buttonText: section2.buttonText,
          image: section2.image,
          content: await section2.description(),
        }}
        section3={{
          title: section3.title,
          buttonPageLink: section3.buttonPageLink,
          buttonText: section3.buttonText,
          image: section3.image,
          images: section3.images,
          content: await section3.description(),
        }}
        section4={{
          title: section4.title,
          buttonPageLink: section4.buttonPageLink,
          buttonText: section4.buttonText,
          image: section4.image,
          images: section4.images,
          content: await section4.description(),
        }}
        section5={{
          title: section5.title,
          buttonPageLink: section5.buttonPageLink,
          buttonText: section5.buttonText,
          images: section5.images,
          content: await section5.description(),
        }}
        section6={{
          title: section6.title,
          buttonPageLink: section6.buttonPageLink,
          buttonText: section6.buttonText,
          testimonials: section6.testimonials,
        }}
        section7={{
          title: section7.title,
          buttonPageLink: section7.buttonPageLink,
          buttonText: section7.buttonText,
          image: section7.image,
          content: await section7.description(),
        }}
      />
    </div>
  );
}
