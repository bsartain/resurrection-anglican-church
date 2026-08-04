"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Container } from "react-bootstrap";

// Route-level boundary for /liturgy. The page is force-dynamic and depends on
// three third-party services (Planning Center, ESV, the Daily Office psalter),
// so a Sunday-morning outage is a real possibility. Say so plainly and give
// people somewhere to go, instead of the generic app error screen.
export default function LiturgyError({ error, reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  useEffect(() => {
    console.error("Liturgy page failed to render", error);
  }, [error]);

  return (
    <div className="liturgy-container liturgy-error">
      <Container className="pt-5 pb-5">
        <h1>We couldn&rsquo;t load this Sunday&rsquo;s liturgy.</h1>
        <p>
          The order of service comes from Planning Center, and something went wrong on the way. If you&rsquo;re with us in the service, a
          printed copy is available at the back.
        </p>
        <div className="liturgy-error-actions">
          <button type="button" className="btn btn-primary" onClick={() => reset()}>
            Try again
          </button>
          <Link href="/plan-your-visit" className="liturgy-error-link">
            Service times &amp; directions
          </Link>
        </div>
      </Container>
    </div>
  );
}