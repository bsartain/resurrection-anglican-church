"use client";

import Link from "next/link";
import { trackEvent } from "../lib/gtm";
import menuItems from "@/app/lib/menuItems.json";

export default function FooterNavLinks() {
  return (
    <ul>
      {menuItems?.map((item: any, index: number) => (
        <li key={index}>
          <Link
            href={item.href}
            onClick={() => {
              trackEvent("footer_nav_button_click", {
                button_text: item.label,
                button_destination: item.href,
              });
            }}
          >
            {item.label}
          </Link>
        </li>
      ))}

      <li className="mt-5">
        <div className="d-flex flex-column social-links">
          <span className="footer-label mb-2">Social Links</span>
          <div className="d-flex">
            <Link href="https://www.facebook.com/resurrectionrockhill" target="_blank">
              <i className="bi bi-facebook me-2" />
            </Link>
            <Link href="https://www.instagram.com/resurrectionrockhill/" target="_blank">
              <i className="bi bi-instagram" />
            </Link>
          </div>
        </div>
      </li>
    </ul>
  );
}
