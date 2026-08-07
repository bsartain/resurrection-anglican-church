"use client";

import { useSyncExternalStore } from "react";

interface Props {
  readonly address?: string | null;
  readonly className?: string;
  readonly label?: string;
}

/** Google Maps' universal URL works in every browser, so it is the safe default. */
const googleMapsUrl = (address: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

/**
 * Picks the maps app the visitor's device actually has.
 *
 * Resolved in the browser rather than from a user-agent check on the server:
 * the page is statically cached, so any server-side guess would be baked in
 * for every visitor.
 */
function deviceDirectionsUrl(address: string): string {
  const destination = encodeURIComponent(address);
  const ua = navigator.userAgent;

  // iPadOS reports itself as a Mac, distinguished only by touch support.
  const isApple = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  if (isApple) return `https://maps.apple.com/?daddr=${destination}&dirflg=d`;

  // `geo:` hands off to whichever maps app is set as the default.
  if (/Android/i.test(ua)) return `geo:0,0?q=${destination}`;

  return googleMapsUrl(address);
}

// The device never changes mid-visit, so there is nothing to subscribe to —
// useSyncExternalStore is here purely for its server/client snapshot split,
// which renders the universal URL on the server and the device-specific one
// in the browser without a hydration mismatch.
const subscribe = () => () => {};

export default function GetDirectionsButton({ address, className, label = "Get Directions" }: Readonly<Props>) {
  const href = useSyncExternalStore(
    subscribe,
    () => (address ? deviceDirectionsUrl(address) : ""),
    () => (address ? googleMapsUrl(address) : "")
  );

  if (!address) return null;

  // `geo:` and `maps.apple.com` hand off to a native app; opening those in a
  // new tab would leave a blank window behind.
  const isWebUrl = href.startsWith("http");

  return (
    <a
      className={className ?? "btn btn-primary-light get-directions-button"}
      href={href}
      target={isWebUrl ? "_blank" : undefined}
      rel={isWebUrl ? "noopener noreferrer" : undefined}
    >
      <i className="bi bi-signpost-split me-2" aria-hidden="true" />
      {label}
      <span className="visually-hidden"> to {address}</span>
    </a>
  );
}
