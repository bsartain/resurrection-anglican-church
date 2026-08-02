"use client";

import { usePathname } from "next/navigation";
import MainNav from "./MainNav";
import { LiturgyDrawerProvider } from "../context/LiturgyDrawerContext";

export default function ConditionalLayout({ children, footer }: Readonly<{ children: React.ReactNode; footer: React.ReactNode }>) {
  const pathname = usePathname();
  const isKeystatic = pathname?.startsWith("/keystatic");

  return (
    <LiturgyDrawerProvider>
      {!isKeystatic && <MainNav />}
      <main>{children}</main>
      {!isKeystatic && footer}
    </LiturgyDrawerProvider>
  );
}
