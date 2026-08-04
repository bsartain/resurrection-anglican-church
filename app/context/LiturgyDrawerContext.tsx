"use client";
import { createContext, useContext, useMemo, useState } from "react";
import type { LiturgySection } from "../lib/liturgyMarkup";

// `sections` is the ordered service outline; `activeSlug` is the section the
// reader is currently on, published by LiturgyReader's IntersectionObserver and
// consumed by the bottom drawer to highlight the list and drive prev/next.
const PrimaryLiturgyDrawerContext = createContext<{
  drawerContent: LiturgySection[];
  setDrawerContent: React.Dispatch<React.SetStateAction<LiturgySection[]>>;
  activeSlug: string | null;
  setActiveSlug: React.Dispatch<React.SetStateAction<string | null>>;
}>({
  drawerContent: [],
  setDrawerContent: () => {},
  activeSlug: null,
  setActiveSlug: () => {},
});

export function LiturgyDrawerProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [drawerContent, setDrawerContent] = useState<LiturgySection[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const value = useMemo(() => ({ drawerContent, setDrawerContent, activeSlug, setActiveSlug }), [drawerContent, activeSlug]);

  return <PrimaryLiturgyDrawerContext.Provider value={value}>{children}</PrimaryLiturgyDrawerContext.Provider>;
}

export function usePrimaryLiturgyDrawer() {
  return useContext(PrimaryLiturgyDrawerContext);
}