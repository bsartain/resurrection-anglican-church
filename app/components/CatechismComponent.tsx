"use client";
import { useEffect, useMemo, useState } from "react";
import catechismData from "@/app/lib/catechism.json";
import thirtyNineArticles from "@/app/lib/thityNineArticles.json";
import { Tabs, Tab } from "react-bootstrap";
import { trackEvent } from "@/app/lib/gtm";
import Accordion from "react-bootstrap/Accordion";

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

const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const CatechismComponent = ({ activeKey, onSelect }: { activeKey?: string; onSelect?: (k: string | null) => void } = {}) => {
  const [activeSection, setActiveSection] = useState("");
  const [value, setValue] = useState("");

  // Filter the catechism while preserving the part -> section -> question shape,
  // dropping any section or part left with no matching questions.
  const parts = useMemo(() => {
    const allParts = catechismData.parts as CatechismPart[];
    const term = value.trim();
    if (!term) return allParts;

    const regex = new RegExp(escapeRegExp(term), "i");

    return allParts
      .map((part) => ({
        ...part,
        sections: part.sections
          .map((section) => ({
            ...section,
            questions: section.questions?.filter((q) => regex.test(q.question) || regex.test(q.answer)),
          }))
          .filter((section) => section.questions?.length),
      }))
      .filter((part) => part.sections.length);
  }, [value]);

  const sectionIds = useMemo(
    () => (catechismData.parts as CatechismPart[]).flatMap((part) => part.sections.map((section) => slugify(section.section))),
    []
  );

  // Highlight the section currently in view in the sidebar table of contents.
  useEffect(() => {
    const headings = sectionIds.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -65% 0px" }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [sectionIds]);

  const handleTabSelect = (key: string | null) => {
    if (key) trackEvent("catechism_tab_click", { tab: key });
    onSelect?.(key);
  };

  const tabProps = activeKey ? { activeKey, onSelect: handleTabSelect } : { defaultActiveKey: "catechism", onSelect: handleTabSelect };

  const renderArticle = (article: Article) => (
    <article key={article.number} className="article-card">
      <h3 className="article-card__title">
        <span className="article-card__number">{article.number}</span>
        <span>{article.title}</span>
      </h3>
      <p className="article-card__text">{article.text}</p>
    </article>
  );

  return (
    <Tabs {...tabProps} id="uncontrolled-tab-example" className="formularies-tabs mb-3 mt-5">
      <Tab eventKey="catechism" title="To Be A Christian - Anglican Catechism">
        <div className="catechism-container">
          <div className="catechism-layout">
            <div className="catechism-layout__aside">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="floatingInput" value={value} onChange={(e) => setValue(e.target.value)} />
                <label htmlFor="floatingInput">Search</label>
              </div>
              <nav className="catechism-toc" aria-label="Catechism contents">
                <p className="catechism-toc__title">Contents</p>
                <div className="catechism-toc__scroll">
                  {parts.map((part) => (
                    <div key={part.part} className="catechism-toc__group">
                      <p className="catechism-toc__part">
                        Part {part.part} &middot; {part.title}
                      </p>
                      <ul className="catechism-toc__list">
                        {part.sections.map((section) => {
                          const id = slugify(section.section);
                          return (
                            <li key={section.section}>
                              <a
                                href={`#${id}`}
                                className={`catechism-toc__link${activeSection === id ? " is-active" : ""}`}
                                onClick={() => trackEvent("catechism_toc_click", { section: section.section })}
                              >
                                {section.section}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </nav>
            </div>

            <div className="catechism-layout__main">
              {!parts.length ? <p className="catechism-empty">No questions match &ldquo;{value.trim()}&rdquo;.</p> : null}

              {parts.map((part) => (
                <section key={part.part} id={`part-${part.part}`} className="catechism-part">
                  <header className="catechism-part__header">
                    <p className="catechism-part__eyebrow">Part {part.part}</p>
                    <h2 className="catechism-part__title">{part.title}</h2>
                    <span className="catechism-ornament" aria-hidden="true" />
                  </header>

                  {part.sections.map((section) => (
                    <div key={section.section} className="catechism-section">
                      <h3 id={slugify(section.section)} className="catechism-section__title">
                        {section.section}
                      </h3>

                      {section.questions?.length ? (
                        <Accordion className="catechism-accordion" alwaysOpen>
                          {section.questions.map((item) => (
                            <Accordion.Item
                              key={item.number}
                              eventKey={`${slugify(section.section)}-${item.number}`}
                              onMouseEnter={() =>
                                trackEvent("catechism_question_hover", {
                                  question_number: item.number,
                                  question: item.question,
                                })
                              }
                            >
                              <Accordion.Header>
                                <span className="catechism-number">{item.number}</span>
                                <span className="catechism-question">{item.question}</span>
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="catechism-answer">
                                  {item.answer.split("\n").map((line, i) => (
                                    <p key={i}>{line}</p>
                                  ))}
                                </div>

                                {item.scriptures.length ? (
                                  <p className="catechism-scriptures">
                                    <span className="catechism-scriptures__label">Scripture</span>
                                    {item.scriptures.join(" · ")}
                                  </p>
                                ) : null}

                                {item.articlesText ? (
                                  <div className="catechism-articles">
                                    <p className="catechism-articles__label">Articles of Religion {item.articlesNumber}</p>
                                    {item.articlesText.split("\n").map((line, i) => (
                                      <p key={i} className="mb-0">
                                        {line}
                                      </p>
                                    ))}
                                  </div>
                                ) : null}
                              </Accordion.Body>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                      ) : null}
                    </div>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </div>
      </Tab>
      <Tab eventKey="bcp" title="Book of Common Prayer">
        <div className="bcp-viewer">
          <iframe
            src="https://docs.google.com/viewer?url=https://bcp2019.anglicanchurch.net/wp-content/uploads/2019/08/BCP2019.pdf&embedded=true#page=3"
            title="Book of Common Prayer 2019"
          />
        </div>
      </Tab>
      <Tab eventKey="thirtyNine" title="Thirty Nine Articles of Religion">
        <div className="thirty-nine-container">
          {(thirtyNineArticles.parts as Part[]).map((part) => (
            <section key={part.part} className="articles-part">
              <header className="articles-part__header">
                <p className="articles-part__eyebrow">Part {part.part}</p>
                <h2 className="articles-part__title">{part.title}</h2>
                <p className="articles-part__range">Articles {part.articles}</p>
                <span className="catechism-ornament" aria-hidden="true" />
              </header>

              {part.items?.map(renderArticle)}

              {part.subsections?.map((subsection) => (
                <div key={subsection.label} className="articles-subsection">
                  <h3 className="articles-subsection__title">
                    {subsection.label}. {subsection.title}
                    <span className="articles-subsection__range">Articles {subsection.articles}</span>
                  </h3>
                  {subsection.items.map(renderArticle)}
                </div>
              ))}
            </section>
          ))}
        </div>
      </Tab>
    </Tabs>
  );
};

export default CatechismComponent;
