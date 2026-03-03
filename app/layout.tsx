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
      <body>
        <ConditionalLayout footer={<Footer />}>{children}</ConditionalLayout>
        <RefTagger />
        <SpecialAnnouncements />
      </body>
    </html>
  );
}
