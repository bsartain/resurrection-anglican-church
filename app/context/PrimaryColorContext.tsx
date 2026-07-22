"use client";
import { createContext, useContext, useEffect, useState } from "react";

const COLOR_MAP: Record<string, string> = {
  green: "#1e3a0c",
  red: "#7d0b05",
  gold: "#806202",
  purple: "#391837",
  white: "#806202",
};

const DEFAULT_COLOR = "#f5f1e8";

const PrimaryColorContext = createContext<string>(DEFAULT_COLOR);

export function PrimaryColorProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    const today = new Date();
    const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    fetch(`https://api.dailyoffice2019.com/api/v1/office/midday_prayer/${date}`)
      .then((r) => r.json())
      .then((json) => {
        const color = json?.calendar_day?.primary_color;
        setPrimaryColor(COLOR_MAP[color] ?? DEFAULT_COLOR);
      })
      .catch(() => {});
  }, []);

  return <PrimaryColorContext.Provider value={primaryColor}>{children}</PrimaryColorContext.Provider>;
}

export function usePrimaryColor() {
  return useContext(PrimaryColorContext);
}
