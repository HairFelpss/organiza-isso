import { Platform } from "react-native";

export const typography = {
  fonts: {
    sans: Platform.select({
      web: "var(--font-geist-sans)",
      default: "System",
    }),
    mono: Platform.select({
      web: "var(--font-geist-mono)",
      default: "SpaceMono",
    }),
  },
  weights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
  },
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

export type Typography = typeof typography;
export type FontFamily = keyof typeof typography.fonts;
export type FontWeight = keyof typeof typography.weights;
export type FontSize = keyof typeof typography.sizes;
export type LineHeight = keyof typeof typography.lineHeights;
