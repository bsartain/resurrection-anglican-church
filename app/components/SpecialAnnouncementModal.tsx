"use client";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { DocumentElement } from "@keystatic/core";

const SpecialAnnouncementModal = ({
  announcement,
  content,
  showAnnouncement,
}: {
  announcement: string | undefined;
  content: DocumentElement[] | undefined;
  showAnnouncement: boolean | undefined;
}) => {
  const [showModal, setShowModal] = useState(() => {
    const hasSeen = sessionStorage.getItem("announcementSeen");
    return showAnnouncement && !hasSeen;
  });

  const handleClose = () => {
    sessionStorage.setItem("announcementSeen", "true");
    setShowModal(false);
  };
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" className="special-announcement-container">
      <Modal.Body>
        <div className="d-flex justify-content-end">
          <i className="bi bi-x-circle" onClick={() => handleClose()} aria-label="Close announcement"></i>
        </div>

        <div className="d-flex justify-content-center">
          <i className="bi bi-info-circle-fill"></i>
        </div>
        <h2 className="text-center">{announcement}</h2>

        <div className="p-5">{content ? <DocumentRenderer document={content} /> : null}</div>
      </Modal.Body>
    </Modal>
  );
};

export default SpecialAnnouncementModal;
