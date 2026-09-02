"use client";
import { useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { DocumentElement } from "@keystatic/core";

/* Whether this announcement has been dismissed lives in sessionStorage, which
   only exists in the browser — reading it through useSyncExternalStore keeps
   the server and client renders in step instead of mismatching on hydration.
   The in-memory set is the fallback for browsers that block storage, so
   closing the modal still works there (it just won't persist). */
const listeners = new Set<() => void>();
const dismissedThisRender = new Set<string>();

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
};

const isDismissed = (key: string) => {
  if (dismissedThisRender.has(key)) return true;
  try {
    return sessionStorage.getItem(key) === "true";
  } catch {
    return false;
  }
};

const dismiss = (key: string) => {
  dismissedThisRender.add(key);
  try {
    sessionStorage.setItem(key, "true");
  } catch {
    // Storage blocked — the dismissal holds for this page view only.
  }
  listeners.forEach((onChange) => onChange());
};

const SpecialAnnouncementModal = ({
  announcement,
  content,
  image,
  linkLabel,
  linkUrl,
  showAnnouncement,
}: {
  announcement: string | undefined;
  content: DocumentElement[] | undefined;
  image: string | undefined | null;
  linkLabel: string | undefined | null;
  linkUrl: string | undefined | null;
  showAnnouncement: boolean | undefined;
}) => {
  // The key carries the announcement title, so publishing a new announcement
  // re-opens the modal for someone who dismissed the previous one this session.
  const seenKey = `announcementSeen:${announcement ?? ""}`;

  const seen = useSyncExternalStore(
    subscribe,
    useCallback(() => isDismissed(seenKey), [seenKey]),
    // On the server there is no storage to read, so render as already-seen and
    // let the modal fade in once the client takes over.
    () => true
  );

  const handleClose = () => dismiss(seenKey);

  if (!showAnnouncement || !announcement) return null;

  return (
    <Modal
      show={!seen}
      onHide={handleClose}
      size="lg"
      centered
      scrollable
      aria-labelledby="special-announcement-title"
      className="special-announcement-container"
    >
      <Modal.Body>
        <button type="button" className="announcement-close" onClick={handleClose} aria-label="Close announcement">
          <i className="bi bi-x-lg" aria-hidden="true"></i>
        </button>

        <div className="announcement-grid">
          {image ? (
            <div className="announcement-media">
              <Image
                src={image}
                alt={announcement}
                width={1200}
                height={900}
                sizes="(max-width: 767px) 100vw, 45vw"
                priority
              />
            </div>
          ) : null}

          <div className={`announcement-body${image ? "" : " announcement-body--full"}`}>
            <p className="announcement-eyebrow">Special Announcement</p>
            <h2 id="special-announcement-title" className="announcement-title">
              {announcement}
            </h2>
            <span className="announcement-rule" aria-hidden="true"></span>

            {content ? (
              <div className="announcement-content">
                <DocumentRenderer document={content} />
              </div>
            ) : null}

            <div className="announcement-actions">
              {linkUrl ? (
                <a
                  className="announcement-cta"
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                >
                  {linkLabel || "Learn more"}
                </a>
              ) : null}
              <button type="button" className="announcement-dismiss" onClick={handleClose}>
                {linkUrl ? "Not now" : "Got it"}
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SpecialAnnouncementModal;
