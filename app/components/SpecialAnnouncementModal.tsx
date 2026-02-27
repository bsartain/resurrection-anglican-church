"use client";
import { useState, useEffect } from "react";
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
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (showAnnouncement !== undefined) {
      setShowModal(showAnnouncement);
    }
  }, []);
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" className="special-announcement-container">
      <Modal.Header closeButton>
        <Modal.Title>{announcement}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        modal render
        {content ? <DocumentRenderer document={content} /> : null}
      </Modal.Body>
    </Modal>
  );
};

export default SpecialAnnouncementModal;
