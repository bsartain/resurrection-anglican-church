"use client";

import { Container } from "react-bootstrap";

export default function DonateButtonModal({ donateButtonText }: { donateButtonText: string }) {
  return (
    <div>
      <Container className="text-center donate-button-container">
        <form action="https://www.paypal.com/donate" method="post" target="_blank">
          <input type="hidden" name="hosted_button_id" value="KDZTTYG3UZPE6" />
          <button
            type="button"
            className="btn btn-primary btn-lg btn-block donate-button"
            onClick={() => window.open("https://www.paypal.com/donate/?hosted_button_id=KDZTTYG3UZPE6", "_blank")}
          >
            {donateButtonText}
          </button>
        </form>
      </Container>
    </div>
  );
}
