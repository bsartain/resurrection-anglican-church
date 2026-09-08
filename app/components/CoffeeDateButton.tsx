"use client";
import { useState } from "react";
import { Modal, Spinner } from "react-bootstrap";

export default function CoffeeDateButton() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <button className="btn btn-primary btn-lg" onClick={() => setShow(true)}>
        Let&apos;s Get Coffee!
      </button>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Schedule a time on my calendar, and let&apos;s grab coffee together.</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 0, height: "80vh", position: "relative" }}>
          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                zIndex: 10,
              }}
            >
              <Spinner animation="border" />
            </div>
          )}
          <iframe
            src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2LFLn5WdnPKwQ9OxfDmDBZslLfV63ZO59RKz-FFWfSbbvC_fkqlaPUL9zg1RWAup-YRkusNc-D"
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Book an Appointment"
            onLoad={() => setLoading(false)}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
