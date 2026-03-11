"use client";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import faqData from "@/app/lib/visitFaq.json";

export default function VisitFAQ() {
  const firstFew = faqData.filter((item) => item.id < 5);
  const lastFew = faqData.filter((item) => item.id > 4);

  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const [activeRight, setActiveRight] = useState<string | null>(null);

  return (
    <div className="faq">
      <Accordion flush activeKey={activeLeft ?? undefined} onSelect={(k) => setActiveLeft(k as string | null)}>
        <div>
          {firstFew.map((item, index) => (
            <Accordion.Item key={index} eventKey={String(index)}>
              <Accordion.Header>
                <span className="me-auto">{item.question}</span>
                <i className={activeLeft === String(index) ? "bi bi-dash-lg" : "bi bi-plus-lg"} />
              </Accordion.Header>
              <Accordion.Body>{item.answer}</Accordion.Body>
            </Accordion.Item>
          ))}
        </div>
      </Accordion>

      <Accordion flush activeKey={activeRight ?? undefined} onSelect={(k) => setActiveRight(k as string | null)}>
        <div>
          {lastFew.map((item, index) => (
            <Accordion.Item key={`lastThree-${index}`} eventKey={String(index)}>
              <Accordion.Header>
                <span className="me-auto">{item.question}</span>
                <i className={activeRight === String(index) ? "bi bi-dash-lg" : "bi bi-plus-lg"} />
              </Accordion.Header>
              <Accordion.Body>{item.answer}</Accordion.Body>
            </Accordion.Item>
          ))}
        </div>
      </Accordion>
    </div>
  );
}
