import { DocumentRenderer } from "@keystatic/core/renderer";
import { DocumentElement } from "@keystatic/core";
import RevealSection from "../RevealSection";

const GospelComponent: React.FC<{ pageContent: DocumentElement[] | undefined }> = ({ pageContent }) => {
  return (
    <div className="gospel-container">
      <RevealSection id="kidsContent" image="/images/pages/jesus-cross.jpg" opacity={0.015}>
        <div className="pt-5 pb-5 reveal">
          <DocumentRenderer document={pageContent ?? []} />
        </div>
      </RevealSection>
    </div>
  );
};

export default GospelComponent;
