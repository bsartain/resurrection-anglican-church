"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { DailyOffice, OfficeKey } from "@/app/lib/getDailyOffice";

// Before noon a visitor most likely wants Morning Prayer; after, Evening.
const preferredOffice = (): OfficeKey => (new Date().getHours() < 12 ? "morning" : "evening");

type LoadState = "loading" | "ready" | "unavailable";

export default function DailyOfficeCard() {
  const [office, setOffice] = useState<DailyOffice | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [activeKey, setActiveKey] = useState<OfficeKey>("morning");
  const [expanded, setExpanded] = useState(false);
  const [loadingText, setLoadingText] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/daily-office", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data: DailyOffice) => {
        setOffice(data);
        // Fall back to whichever office the API actually returned.
        const wanted = preferredOffice();
        setActiveKey(data.services.some((service) => service.key === wanted) ? wanted : data.services[0].key);
        setState("ready");
      })
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setState("unavailable");
      });

    return () => controller.abort();
  }, []);

  const activeService = useMemo(() => office?.services.find((service) => service.key === activeKey), [office, activeKey]);

  // Text is fetched separately so the initial card stays small — the full
  // lessons and psalms are tens of kilobytes.
  const loadFullText = useCallback(async () => {
    if (!office || office.services.some((service) => service.readings.some((reading) => reading.text))) return;

    setLoadingText(true);
    try {
      const response = await fetch(`/api/daily-office?date=${encodeURIComponent(office.date)}&full=1`);
      if (response.ok) setOffice(await response.json());
    } catch {
      // Citations are still on screen, and the "Read the full Office" link works.
    } finally {
      setLoadingText(false);
    }
  }, [office]);

  const toggleExpanded = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) void loadFullText();
  };

  if (state === "loading") {
    return (
      <div className="daily-office-card daily-office-card--loading" aria-busy="true" aria-live="polite">
        <span className="visually-hidden">Loading today&rsquo;s Daily Office&hellip;</span>
        <div className="daily-office-skeleton daily-office-skeleton--sm" />
        <div className="daily-office-skeleton" />
        <div className="daily-office-skeleton" />
      </div>
    );
  }

  // No card at all would leave a hole in the section, so fall back to the link
  // that was there before the widget existed.
  if (state === "unavailable" || !office) {
    return (
      <div className="daily-office-card daily-office-card--fallback">
        <p className="daily-office-eyebrow">The Daily Office</p>
        <p className="mb-3">Today&rsquo;s readings couldn&rsquo;t be loaded right now.</p>
        <Link href="https://www.dailyoffice2019.com/" target="_blank" rel="noopener noreferrer" className="btn btn-primary-light">
          Pray the Daily Office
        </Link>
      </div>
    );
  }

  return (
    <div className="daily-office-card">
      <div className="daily-office-header">
        <div>
          <p className="daily-office-eyebrow">Today&rsquo;s Daily Office</p>
          <p className="daily-office-date">{office.dateLabel}</p>
        </div>
        {office.season || office.commemoration ? (
          <div className="daily-office-season">
            {office.commemoration ? <span className="daily-office-feast">{office.commemoration}</span> : null}
            {office.season ? <span>{office.season}</span> : null}
          </div>
        ) : null}
      </div>

      {office.services.length > 1 ? (
        <div className="daily-office-tabs" role="tablist" aria-label="Choose an office">
          {office.services.map((service) => (
            <button
              key={service.key}
              type="button"
              role="tab"
              id={`daily-office-tab-${service.key}`}
              aria-selected={service.key === activeKey}
              aria-controls={`daily-office-panel-${service.key}`}
              className={service.key === activeKey ? "daily-office-tab is-active" : "daily-office-tab"}
              onClick={() => setActiveKey(service.key)}
            >
              {service.label}
            </button>
          ))}
        </div>
      ) : null}

      {activeService ? (
        <div role="tabpanel" id={`daily-office-panel-${activeService.key}`} aria-labelledby={`daily-office-tab-${activeService.key}`}>
          <ul className="daily-office-readings">
            {activeService.readings.map((reading) => (
              <li key={`${reading.name}-${reading.citation}`}>
                <span className="daily-office-reading-name">{reading.name}</span>
                <span className="daily-office-reading-citation">{reading.citation}</span>
              </li>
            ))}
          </ul>

          <div className="daily-office-actions">
            <button type="button" className="btn btn-primary-light" onClick={toggleExpanded} aria-expanded={expanded}>
              {expanded ? "Hide the readings" : "Read Today's Office"}
              <i className={expanded ? "bi bi-chevron-up ms-2" : "bi bi-chevron-down ms-2"} aria-hidden="true" />
            </button>
            <Link href="https://www.dailyoffice2019.com/" target="_blank" rel="noopener noreferrer" className="daily-office-link">
              Pray the full Office
              <i className="bi bi-box-arrow-up-right ms-2" aria-hidden="true" />
            </Link>
          </div>

          {expanded ? (
            <div className="daily-office-text" aria-live="polite">
              {loadingText ? (
                <p className="daily-office-loading-text">Loading today&rsquo;s readings&hellip;</p>
              ) : (
                activeService.readings.map((reading) => (
                  <section key={`text-${reading.name}-${reading.citation}`} className="daily-office-passage">
                    <h4>
                      {reading.name}
                      <span className="daily-office-passage-citation">{reading.citation}</span>
                    </h4>
                    {reading.text ? (
                      // Markup comes from dailyoffice2019.com — the same trusted
                      // source already used for the liturgical calendar.
                      <div dangerouslySetInnerHTML={{ __html: reading.text }} />
                    ) : (
                      <p className="daily-office-loading-text">This reading couldn&rsquo;t be loaded. Please follow along in your Bible.</p>
                    )}
                  </section>
                ))
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
