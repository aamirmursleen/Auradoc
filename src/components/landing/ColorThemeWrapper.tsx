'use client'

import { type ReactNode } from "react";
import { type ColorTheme } from "./colorThemes";

const ColorThemeWrapper = ({
  theme,
  children,
}: {
  theme: ColorTheme;
  children: ReactNode;
}) => {
  const { hue: h, saturation: s, lightness: l, darkLightness: dl } = theme;

  const lightVars: Record<string, string> = {
    "--primary": `${h} ${s}% ${l}%`,
    "--accent": `${h} ${s}% ${l}%`,
    "--ring": `${h} ${s}% ${l}%`,
    "--card": `${h} 100% 98%`,
    "--secondary": `${h} 60% 95%`,
    "--muted": `${h} 30% 96%`,
    "--border": `${h} 30% 90%`,
    "--input": `${h} 30% 90%`,
    "--section-alt": `${h} 60% 97%`,
    "--sidebar-primary": `${h} ${s}% ${l}%`,
    "--sidebar-ring": `${h} ${s}% ${l}%`,
    "--sidebar-accent": `${h} 60% 95%`,
    "--sidebar-border": `${h} 30% 90%`,
    "--browser-chrome": `${h} ${s}% 10%`,
    "--browser-bar": `${h} ${s}% 16%`,
  };

  const darkVars: Record<string, string> = {
    "--primary": `${h} ${s}% ${dl}%`,
    "--accent": `${h} ${s}% ${dl}%`,
    "--ring": `${h} ${s}% ${dl}%`,
    "--card": `${h} 20% 8%`,
    "--secondary": `${h} 20% 14%`,
    "--muted": `${h} 15% 14%`,
    "--muted-foreground": `${h} 10% 58%`,
    "--border": `${h} 15% 18%`,
    "--input": `${h} 15% 18%`,
    "--section-alt": `${h} 15% 6%`,
    "--sidebar-primary": `${h} ${s}% ${dl}%`,
    "--sidebar-ring": `${h} ${s}% ${dl}%`,
    "--sidebar-accent": `${h} 15% 16%`,
    "--sidebar-border": `${h} 15% 18%`,
    "--browser-chrome": `${h} ${s}% 10%`,
    "--browser-bar": `${h} ${s}% 16%`,
  };

  const lightCSS = Object.entries(lightVars)
    .map(([k, v]) => `${k}: ${v};`)
    .join("\n    ");

  const darkCSS = Object.entries(darkVars)
    .map(([k, v]) => `${k}: ${v};`)
    .join("\n    ");

  return (
    <>
      <style>{`
        .color-theme-override {
          ${lightCSS}
        }
        .dark .color-theme-override,
        .color-theme-override.dark {
          ${darkCSS}
        }
      `}</style>
      <div className="color-theme-override min-h-screen">{children}</div>
    </>
  );
};

export default ColorThemeWrapper;
