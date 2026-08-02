"use client";
import { useEffect } from "react";
import { usePrimaryLiturgyDrawer } from "../context/LiturgyDrawerContext";
import type { ResolvedServiceDataModel } from "../models/serviceModel";

// Bridges server-fetched liturgy data into the client drawer context.
// The liturgy page is a server component and can't touch context directly,
// so it renders this and hands the resolved data down as a prop.
export default function LiturgyDrawerSync({ data }: Readonly<{ data: ResolvedServiceDataModel[] }>) {
  const { setDrawerContent } = usePrimaryLiturgyDrawer();

  useEffect(() => {
    setDrawerContent(data);
  }, [data, setDrawerContent]);

  return null;
}
