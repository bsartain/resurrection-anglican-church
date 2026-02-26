"use client";

import { usePathname } from "next/navigation";
import MainNav from "./MainNav";
import Footer from "./Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isKeystatic = pathname.startsWith("/keystatic");

  return (
    <>
      {!isKeystatic && <MainNav />}
      <main>{children}</main>
      {!isKeystatic && <Footer />}
    </>
  );
}
