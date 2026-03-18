import React from "react";
import HeroImage from "../../components/HeroImage";
import { getPageData } from "../../api/keystatic/lib/keystatic";
import { DocumentRenderer } from "@keystatic/core/renderer";
import RevealSection from "../../components/RevealSection";
import { buildMetadata } from "../../lib/buildMetadata";
import { Container } from "react-bootstrap";

export default async function AnglicanStart() {
  const pageData = await getPageData("anglican-start");
  const pageContent = await pageData?.content();

  return (
    <div className="dark-container anglican-start-container">
      <HeroImage image={pageData?.image ? pageData.image : ""}>{pageData?.title}</HeroImage>

      <RevealSection id="anglicanStartContent" image="/images/pages/jesus-cross.jpg" opacity={0.015}>
        <Container className="reveal" style={{ maxWidth: "780px" }}>
          <div className="pt-5 pb-5">
            <DocumentRenderer
              document={pageContent ?? []}
              renderers={{
                block: {
                  heading: ({ level, children }) => {
                    if (level === 4) {
                      return <p className="as-attribution">{children}</p>;
                    }
                    if (level === 1) {
                      return (
                        <div className="as-main-heading">
                          <h1>{children}</h1>
                          <div className="d-flex justify-content-center w-100">
                            <hr className="w-25" />
                          </div>
                        </div>
                      );
                    }
                    if (level === 2) {
                      return <h2 className="as-section-heading">{children}</h2>;
                    }
                    const Tag = `h${level}` as React.ElementType;
                    return <Tag>{children}</Tag>;
                  },
                },
                inline: {
                  link: ({ href, children }) => {
                    const isExternal = href.startsWith("http");
                    return (
                      <a href={href} {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}>
                        {children}
                      </a>
                    );
                  },
                },
              }}
            />
          </div>
        </Container>
      </RevealSection>

      <RevealSection id="anglicanStartQuote">
        <Container className="reveal" style={{ maxWidth: "780px" }}>
          <div className="as-closing-quote">
            <blockquote className="as-quote">
              <p>&ldquo;Thy word is a lamp unto my feet, and a light unto my path.&rdquo;</p>
              <footer>— Psalm 119:105</footer>
            </blockquote>
          </div>
        </Container>
      </RevealSection>
    </div>
  );
}

export async function generateMetadata() {
  const pageData = await getPageData("anglican-start");

  return buildMetadata({
    title: pageData?.title,
    excerpt: pageData?.excerpt,
    image: pageData?.image,
    path: "/anglican-start",
  });
}
