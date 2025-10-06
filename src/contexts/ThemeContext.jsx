"use client"; // 👈 Add this line at the very top

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

export const paletteNames = {
  default: "Black & Sky Blue",
  red: "Black & Red",
  "green-yellow": "Black & Green",
  "purple-pink": "Black & Purple",
  "orange-teal": "Black & Orange",
  "navy-gold": "Black & Navy",
};

export function ThemeProvider({ children }) {
  const [palette, setPaletteState] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("acme-color-palette");
      return stored || "default";
    }
    return "default";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (palette === "default") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", palette);
    }
    localStorage.setItem("acme-color-palette", palette);
  }, [palette]);

  const setPalette = (newPalette) => {
    setPaletteState(newPalette);
  };

  return (
    <ThemeContext.Provider value={{ palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
