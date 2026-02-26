// app/components/RefTagger.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

interface Window {
  refTagger?: {
    tag: () => void;
  };
}

export default function RefTagger() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const refTagger = (window as Window & { refTagger?: { tag: () => void } }).refTagger;
      if (refTagger?.tag) {
        refTagger.tag();
      }
    }
  }, [pathname]);

  return (
    <Script
      id="reftagger"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var refTagger = {
            settings: {
              bibleVersion: "ESV",
              openInNewWindow: true
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
