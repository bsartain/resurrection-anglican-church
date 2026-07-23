"use client";
import catechismData from "@/app/lib/catechism.json";
import thirtyNineArticles from "@/app/lib/thityNineArticles.json";
import { Tabs, Tab } from "react-bootstrap";
import { trackEvent } from "@/app/lib/gtm";

type CatechismQuestion = {
  number: number;
  question: string;
  answer: string;
  scriptures: string[];
  articlesText?: string;
  articlesNumber?: number;
};

type CatechismSection = {
  section: string;
  questions?: CatechismQuestion[];
};

type CatechismPart = {
  part: number;
  title: string;
  sections: CatechismSection[];
};

interface Article {
  number: number;
  title: string;
  text: string;
}

interface Subsection {
  label: string;
  title: string;
  articles: string;
  items: Article[];
}

interface Part {
  part: string;
  title: string;
  articles: string;
  items?: Article[];
  subsections?: Subsection[];
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const CatechismComponent = ({ activeKey, onSelect }: { activeKey?: string; onSelect?: (k: string | null) => void } = {}) => {
  const handleTabSelect = (key: string | null) => {
    if (key) trackEvent("catechism_tab_click", { tab: key });
    onSelect?.(key);
  };

  const tabProps = activeKey ? { activeKey, onSelect: handleTabSelect } : { defaultActiveKey: "catechism", onSelect: handleTabSelect };

  const renderArticle = (article: Article) => (
    <div key={article.number} className="mt-5">
      <h3>
        {article.number}. {article.title}
      </h3>
      <p>{article.text}</p>
    </div>
  );

  return (
    <Tabs {...tabProps} id="uncontrolled-tab-example" className="mb-3 mt-5">
      <Tab eventKey="catechism" title=" To Be A Christian - Anglican Catechism">
        <div className="catechism-container">
          <nav className="catechism-toc">
            <div className="header">
              <h1>Contents</h1>
              <hr />
            </div>
            {catechismData.parts.map((part: CatechismPart) => (
              <div key={part.part} className="table-of-contents">
                <h3 className="mt-5">{part.title}</h3>
                <ul className="list-group list-group-flush">
                  {part.sections.map((section: CatechismSection) => (
                    <li key={section.section} className="list-group-item">
                      <a href={`#${slugify(section.section)}`} onClick={() => trackEvent("catechism_toc_click", { section: section.section })}>
                        {section.section}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {catechismData.parts.map((part: CatechismPart, index: number) => {
            return (
              <div key={index} id={`part-${part.part}`}>
                <div className="header">
                  <h1>{part.title}</h1>
                  <hr />
                </div>
                {part.sections.map((section: CatechismSection, index: number) => {
                  return (
                    <div key={index}>
                      <h2 id={slugify(section.section)} className="section-header">
                        {section.section}
                      </h2>
                      <div className="d-flex justify-content-center">
                        <hr className="section-header-divider" />
                      </div>
                      {section.questions
                        ? section.questions.map((item: CatechismQuestion, index: number) => {
                            return (
                              <div
                                key={index}
                                className="sub-section-qa"
                                onMouseEnter={() =>
                                  trackEvent("catechism_question_hover", {
                                    question_number: item.number,
                                    question: item.question,
                                  })
                                }
                              >
                                <h3>
                                  <span className="catechism-number">{item.number}.</span>
                                  <span>{item.question}</span>
                                </h3>
                                <div>
                                  {item.answer.split("\n").map((line, i) => (
                                    <p key={i} className="mb-1">
                                      {line}
                                    </p>
                                  ))}
                                </div>

                                <div className="mt-4">{item.scriptures.join(", ")}</div>
                                {item?.articlesText ? (
                                  <div className="mt-3">
                                    <strong>Articles of Religion {item?.articlesNumber}:&nbsp;</strong>
                                    {item.articlesText.split("\n").map((line, i) => (
                                      <p key={i} className="mb-1">
                                        {line}
                                      </p>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            );
                          })
                        : null}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Tab>
      <Tab eventKey="bcp" title="Book of Common Prayer">
        <iframe
          src="https://docs.google.com/viewer?url=https://bcp2019.anglicanchurch.net/wp-content/uploads/2019/08/BCP2019.pdf&embedded=true#page=3"
          style={{ width: "100%", height: "85vh", border: "none" }}
          title="Book of Common Prayer 2019"
        />
      </Tab>
      <Tab eventKey="thirtyNine" title="Thirty Nine Articles of Religion">
        {thirtyNineArticles.parts.map((part: Part, index: number) => {
          return (
            <div key={index} className="mt-5 mb-5">
              <h2 style={{ marginTop: "150px" }}>
                Part {part.part}{" "}
                <h3>
                  {part.articles} {part.title}
                </h3>
                <hr className="thirty-nine-articles-divider" />
              </h2>

              {part.items?.map(renderArticle)}

              {part.subsections?.map((subsection: Subsection, subIndex: number) => (
                <div key={subIndex} className="mt-5">
                  <h4>
                    {subsection.label}. {subsection.title} ({subsection.articles})
                  </h4>
                  {subsection.items.map(renderArticle)}
                </div>
              ))}
            </div>
          );
        })}
      </Tab>
    </Tabs>
  );
};

export default CatechismComponent;
