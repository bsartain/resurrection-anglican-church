import catechismData from "@/app/lib/catechism.json";

const CatechismComponent = () => {
  return (
    <div className="catechism-container">
      {catechismData.parts.map((item: any, index: number) => {
        return (
          <div key={index}>
            <div className="header">
              <h1>{item.title}</h1>
              <hr />
            </div>
            {item.sections.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <h2 className="section-header">{item.section}</h2>
                  <div className="d-flex justify-content-center">
                    <hr className="section-header-divider" />
                  </div>
                  {item.questions
                    ? item.questions.map((item: any, index: number) => {
                        return (
                          <>
                            <div className="sub-section-qa">
                              <h3>
                                <span className="catechism-number">{item.number}.</span>
                                <span>{item.question}</span>
                              </h3>
                              <div>{item.answer}</div>
                              <div className="mt-4">{item.scriptures.join(", ")}</div>
                            </div>
                          </>
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
