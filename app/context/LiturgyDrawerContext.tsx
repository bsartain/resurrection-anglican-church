"use client";
import { createContext, useContext, useState } from "react";
import type { ResolvedServiceDataModel } from "../models/serviceModel";

const PrimaryLiturgyDrawerContext = createContext<{
  drawerContent: ResolvedServiceDataModel[];
  setDrawerContent: React.Dispatch<React.SetStateAction<ResolvedServiceDataModel[]>>;
}>({
  drawerContent: [],
  setDrawerContent: () => {},
});

export function LiturgyDrawerProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [drawerContent, setDrawerContent] = useState<ResolvedServiceDataModel[]>([]);

  return <PrimaryLiturgyDrawerContext.Provider value={{ drawerContent, setDrawerContent }}>{children}</PrimaryLiturgyDrawerContext.Provider>;
}

export function usePrimaryLiturgyDrawer() {
  return useContext(PrimaryLiturgyDrawerContext);
}
