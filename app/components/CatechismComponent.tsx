import catechismData from "@/app/lib/catechism.json";

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

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const CatechismComponent = () => {
  return (
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
                  <a href={`#${slugify(section.section)}`}>{section.section}</a>
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
                          <div key={index} className="sub-section-qa">
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
                                  <p key={i} className="mb-1">{line}</p>
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
  );
};

export default CatechismComponent;
