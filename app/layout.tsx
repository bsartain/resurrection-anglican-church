import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import ConditionalLayout from "@/app/components/ConditionalLayout";
import RefTagger from "@/app/components/RefTagger";
import Footer from "./components/Footer";
import SpecialAnnouncements from "./components/SpecialAnnouncements";

export const metadata: Metadata = {
  title: "Resurrection Anglican Church | Rock Hill SC",
  description: "Ancient Liturgy | Modern Hearts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TQRZ5MR6');`,
          }}
          id="google-tag-manager"
        />
      </head>
      <body>
        <noscript>
          <iframe
            height="0"
            src="https://www.googletagmanager.com/ns.html?id=GTM-TQRZ5MR6"
            style={{ display: "none", visibility: "hidden" }}
            width="0"
          />
        </noscript>
        <ConditionalLayout footer={<Footer />}>{children}</ConditionalLayout>
        <RefTagger />
        <SpecialAnnouncements />
      </body>
    </html>
  );
}
