"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { usePrimaryLiturgyDrawer } from "../context/LiturgyDrawerContext";

function LiturgyBottomDrawer() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const { drawerContent } = usePrimaryLiturgyDrawer();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleJump = (sequence: number) => {
    handleClose();
    document.getElementById(`liturgy-section-${sequence}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (pathname !== "/liturgy") return null;

  return (
    <div className="liturgy-bottom-drawer-container">
      <Button variant="primary" onClick={handleShow} className="me-2 toc-button">
        <div>
          <i className="bi bi-chevron-compact-up" />
        </div>
        Liturgy Table Of Contents
      </Button>
      <Offcanvas show={show} onHide={handleClose} placement="bottom" className="liturgy-toc-offcanvas">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="text-center w-100">
            Choose a section below to follow the service.{" "}
            <div>
              <i className="bi bi-chevron-compact-down" />
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ol className="liturgy-toc">
            {drawerContent.map((item) => (
              <li key={item.sequence}>
                <button type="button" className="liturgy-toc-link" onClick={() => handleJump(item.sequence)}>
                  {item.title}
                </button>
              </li>
            ))}
          </ol>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default LiturgyBottomDrawer;
