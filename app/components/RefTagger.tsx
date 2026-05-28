"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

export default function RefTagger() {
  const pathname = usePathname();

  useEffect(() => {
    const tryTag = () => {
      const win = window as typeof window & { refTagger?: { tag: () => void } };
      if (win.refTagger?.tag) {
        win.refTagger.tag();
      }
    };

    // Small delay to ensure DOM has updated after navigation
    const timeout = setTimeout(tryTag, 100);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <Script
      id="reftagger"
      strategy="afterInteractive"
      onLoad={() => {
        const win = window as typeof window & { refTagger?: { tag: () => void } };
        win.refTagger?.tag();
      }}
      dangerouslySetInnerHTML={{
        __html: `
          var refTagger = {
            settings: {
              bibleVersion: "ESV",
              openInNewWindow: true,
              tooltipStyle: "dark",
            }
          };
          (function(d, t) {
            var n=d.querySelector('[nonce]');
            refTagger.settings.nonce = n && (n.nonce||n.getAttribute('nonce'));
            var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
            g.src = 'https://api.reftagger.com/v2/RefTagger.js';
            g.nonce = refTagger.settings.nonce;
            s.parentNode.insertBefore(g, s);
          }(document, 'script'));
        `,
      }}
    />
  );
}
