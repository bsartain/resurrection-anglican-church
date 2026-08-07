"use client";

import { useState } from "react";
import Link from "next/link";
import { Accordion } from "react-bootstrap";
import faqData from "@/app/lib/visitFaq.json";

// The questions a first-time visitor asks before they decide to come. The full
// set lives on /plan-your-visit; this is the "answer it before they leave the
// homepage" subset, in the order those worries actually surface.
const FEATURED_QUESTION_IDS = [0, 1, 3, 2, 6] as const;

export default function FirstTimeFAQ() {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const questions = FEATURED_QUESTION_IDS.map((id) => faqData.find((item) => item.id === id)).filter(
    (item): item is (typeof faqData)[number] => Boolean(item)
  );

  return (
    <div className="first-time-faq">
      <p className="first-time-faq-eyebrow">First time here?</p>

      <Accordion flush activeKey={activeKey ?? undefined} onSelect={(key) => setActiveKey(key as string | null)}>
        {questions.map((item) => (
          <Accordion.Item key={item.id} eventKey={String(item.id)}>
            <Accordion.Header>
              <span className="me-auto">{item.question}</span>
              <i className={activeKey === String(item.id) ? "bi bi-dash-lg" : "bi bi-plus-lg"} aria-hidden="true" />
            </Accordion.Header>
            <Accordion.Body>{item.answer}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <Link href="/plan-your-visit#planExpect" className="first-time-faq-more">
        See all questions
        <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
      </Link>
    </div>
  );
}
