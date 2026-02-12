export interface ColorTheme {
  name: string;
  hue: number;
  saturation: number;
  lightness: number;
  darkLightness: number;
}

export const colorThemes: Record<string, ColorTheme> = {
  blue: {
    name: "Ocean Blue",
    hue: 217,
    saturation: 91,
    lightness: 55,
    darkLightness: 65,
  },
  teal: {
    name: "Teal",
    hue: 175,
    saturation: 84,
    lightness: 38,
    darkLightness: 48,
  },
  green: {
    name: "Emerald",
    hue: 152,
    saturation: 76,
    lightness: 38,
    darkLightness: 48,
  },
  rose: {
    name: "Rose",
    hue: 340,
    saturation: 82,
    lightness: 52,
    darkLightness: 62,
  },
  orange: {
    name: "Sunset Orange",
    hue: 25,
    saturation: 95,
    lightness: 53,
    darkLightness: 60,
  },
  red: {
    name: "Crimson",
    hue: 0,
    saturation: 84,
    lightness: 55,
    darkLightness: 62,
  },
  indigo: {
    name: "Indigo",
    hue: 239,
    saturation: 84,
    lightness: 57,
    darkLightness: 67,
  },
};
