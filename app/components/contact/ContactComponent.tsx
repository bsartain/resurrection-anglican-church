import { DocumentElement } from "@keystatic/core";
import { DocumentRenderer } from "@keystatic/core/renderer";
import React from "react";
import { Container } from "react-bootstrap";
import ContactForm from "./ContactForm";
import RevealSection from "../RevealSection";

interface ContactModel {
  title: string;
  image: string | null;
  content: () => Promise<DocumentElement[]>;
  subsections: readonly {
    readonly title: string;
    readonly content: () => Promise<DocumentElement[]>;
    readonly image: string | null;
    readonly imageDirection: "right" | "left";
  }[];
  multipleImages:
    | {
        readonly discriminant: true;
        readonly value: readonly {
          readonly image: string | null;
          readonly caption: string;
          readonly subCaption: string;
        }[];
      }
    | {
        readonly discriminant: false;
        readonly value: null;
      };
}

interface ContactSubSection {
  title: string | null;
  content: () => Promise<DocumentElement[]>;
}

type GoogleMapItem = DocumentElement & {
  type: string;
  children: { text: string }[];
};

const ContactComponent: React.FC<{ pageData: ContactModel | null }> = async ({ pageData }) => {
  const googleMapSubsection = pageData?.subsections.find((item: ContactSubSection) => item.title?.includes("Google"));
  const googleMapArray = await googleMapSubsection?.content();

  return (
    <>
      <RevealSection id="contactInfo">
        <Container className="mt-5 mb-5 contact-component-container">
          <div className="contact-info">
            {pageData?.subsections
              ? pageData.subsections.map(async (item: ContactSubSection, index: number) => {
                  const content = await item.content();
                  if (item.title && !item.title.includes("Google")) {
                    return (
                      <div key={index} className="contact-subsections">
                        <h3>{item.title}</h3>
                        <DocumentRenderer document={content} />
                      </div>
                    );
                  }
                })
              : null}
          </div>
          <ContactForm />
        </Container>
      </RevealSection>
      {googleMapArray && googleMapArray.length > 0
        ? (googleMapArray as GoogleMapItem[])?.map((item: GoogleMapItem, index: number) => {
            if (item.type === "code") {
              return (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html: item.children[0].text,
                  }}
                />
              );
            }
          })
        : null}
    </>
  );
};

export default ContactComponent;
