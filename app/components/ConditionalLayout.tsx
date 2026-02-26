"use client";

import { usePathname } from "next/navigation";
import MainNav from "./MainNav";
import Footer from "./Footer";

export default function ConditionalLayout({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const pathname = usePathname();
  const isKeystatic = pathname?.startsWith("/keystatic");

  return (
    <>
      {!isKeystatic && <MainNav />}
      <main>{children}</main>
      {!isKeystatic && footer}
    </>
  );
}
