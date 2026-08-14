"use client";

import { Spinner } from "react-bootstrap";
import { usePrimaryColor } from "@/app/context/PrimaryColorContext";

export default function Loading() {
  const primaryColor = usePrimaryColor();

  return (
    <div className="full-screen-overlay">
      <Spinner animation="grow" />
    </div>
  );
}
