"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ClinicTheme, ClinicSettings } from "@/db/schema";
import { mockThemes, mockClinicSettings } from "@/db/mock-data";

interface ThemeContextType {
  currentTheme: ClinicTheme;
  themes: ClinicTheme[];
  clinicSettings: ClinicSettings;
  applyTheme: (themeId: string) => Promise<void>;
  updateClinicSettings: (newSettings: Partial<ClinicSettings>) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themes, setThemes] = useState<ClinicTheme[]>(mockThemes);
  const [currentTheme, setCurrentTheme] = useState<ClinicTheme>(mockThemes[0]);
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>(mockClinicSettings);

  const applyThemeToDOM = useCallback((theme: ClinicTheme) => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.setAttribute("data-theme", theme.id);

    if (theme.isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    root.style.setProperty("--theme-primary", theme.primaryColor);
    root.style.setProperty("--theme-secondary", theme.secondaryColor);
    root.style.setProperty("--theme-accent", theme.accentColor);
  }, []);

  useEffect(() => {
    const savedThemeId = localStorage.getItem("novivet_theme_id");
    const active = mockThemes.find((t) => t.id === savedThemeId) || mockThemes[0];
    setCurrentTheme(active);
    applyThemeToDOM(active);

    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setClinicSettings(data.settings);
          if (data.settings.activeThemeId && !savedThemeId) {
            const serverTheme = mockThemes.find((t) => t.id === data.settings.activeThemeId);
            if (serverTheme) {
              setCurrentTheme(serverTheme);
              applyThemeToDOM(serverTheme);
            }
          }
        }
        if (data.themes && Array.isArray(data.themes)) {
          setThemes(data.themes);
        }
      })
      .catch(() => {});
  }, [applyThemeToDOM]);

  const applyTheme = async (themeId: string) => {
    const found = themes.find((t) => t.id === themeId) || mockThemes.find((t) => t.id === themeId);
    if (found) {
      setCurrentTheme(found);
      localStorage.setItem("novivet_theme_id", themeId);
      applyThemeToDOM(found);
      window.dispatchEvent(new CustomEvent("novivet_theme_changed", { detail: { themeId } }));

      try {
        await fetch("/api/admin/themes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "activate", themeId }),
        });
      } catch (e) {
        console.error("Theme sync error:", e);
      }
    }
  };

  const updateClinicSettings = async (newSettings: Partial<ClinicSettings>) => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (data.settings) {
        setClinicSettings(data.settings);
        if (data.settings.activeThemeId) {
          const matched = themes.find((t) => t.id === data.settings.activeThemeId);
          if (matched) {
            setCurrentTheme(matched);
            applyThemeToDOM(matched);
            localStorage.setItem("novivet_theme_id", matched.id);
            window.dispatchEvent(new CustomEvent("novivet_theme_changed", { detail: { themeId: matched.id } }));
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themes, clinicSettings, applyTheme, updateClinicSettings }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
