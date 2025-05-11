import { type ColorValue } from "react-native";

export const Colors = {
  light: {
    // Primary brand colors
    primary: "#0A7EA4" as ColorValue,
    primaryLight: "#A1CEDC" as ColorValue,
    primaryDark: "#065C78" as ColorValue,

    // Background colors
    background: "#FFFFFF" as ColorValue,
    backgroundSecondary: "#F8F9FA" as ColorValue,
    backgroundTertiary: "#F1F3F5" as ColorValue,

    // Text colors
    text: "#11181C" as ColorValue,
    textSecondary: "#687076" as ColorValue,
    textTertiary: "#889096" as ColorValue,

    // Status colors
    success: "#17B26A" as ColorValue,
    warning: "#F5A623" as ColorValue,
    error: "#E5484D" as ColorValue,
    info: "#0A7EA4" as ColorValue,

    // Border colors
    border: "#E6E8EB" as ColorValue,
    borderFocus: "#0A7EA4" as ColorValue,

    // Component specific
    card: "#FFFFFF" as ColorValue,
    cardHover: "#F8F9FA" as ColorValue,
    toast: "#FFFFFF" as ColorValue,
    tooltip: "#11181C" as ColorValue,

    // Icon colors
    icon: "#687076" as ColorValue,
    iconHover: "#11181C" as ColorValue,

    // Input colors
    input: "#FFFFFF" as ColorValue,
    inputBorder: "#E6E8EB" as ColorValue,
    inputPlaceholder: "#889096" as ColorValue,
    inputFocus: "#0A7EA4" as ColorValue,

    // Button colors
    buttonPrimary: "#0A7EA4" as ColorValue,
    buttonPrimaryHover: "#065C78" as ColorValue,
    buttonSecondary: "#F8F9FA" as ColorValue,
    buttonSecondaryHover: "#E6E8EB" as ColorValue,
    buttonDisabled: "#E6E8EB" as ColorValue,
    buttonText: "#FFFFFF" as ColorValue,
    buttonTextSecondary: "#11181C" as ColorValue,
  },
  dark: {
    // Primary brand colors
    primary: "#0A7EA4" as ColorValue,
    primaryLight: "#1D3D47" as ColorValue,
    primaryDark: "#A1CEDC" as ColorValue,

    // Background colors
    background: "#151718" as ColorValue,
    backgroundSecondary: "#1A1D1E" as ColorValue,
    backgroundTertiary: "#202425" as ColorValue,

    // Text colors
    text: "#ECEDEE" as ColorValue,
    textSecondary: "#9BA1A6" as ColorValue,
    textTertiary: "#787F85" as ColorValue,

    // Status colors
    success: "#3CCB7F" as ColorValue,
    warning: "#FFB224" as ColorValue,
    error: "#FF6369" as ColorValue,
    info: "#0A7EA4" as ColorValue,

    // Border colors
    border: "#2A2F30" as ColorValue,
    borderFocus: "#0A7EA4" as ColorValue,

    // Component specific
    card: "#1A1D1E" as ColorValue,
    cardHover: "#202425" as ColorValue,
    toast: "#1A1D1E" as ColorValue,
    tooltip: "#ECEDEE" as ColorValue,

    // Icon colors
    icon: "#9BA1A6" as ColorValue,
    iconHover: "#ECEDEE" as ColorValue,

    // Input colors
    input: "#1A1D1E" as ColorValue,
    inputBorder: "#2A2F30" as ColorValue,
    inputPlaceholder: "#787F85" as ColorValue,
    inputFocus: "#0A7EA4" as ColorValue,

    // Button colors
    buttonPrimary: "#0A7EA4" as ColorValue,
    buttonPrimaryHover: "#A1CEDC" as ColorValue,
    buttonSecondary: "#1A1D1E" as ColorValue,
    buttonSecondaryHover: "#202425" as ColorValue,
    buttonDisabled: "#2A2F30" as ColorValue,
    buttonText: "#ECEDEE" as ColorValue,
    buttonTextSecondary: "#ECEDEE" as ColorValue,
  },
} as const;

export type ColorTheme = typeof Colors.light & typeof Colors.dark;
export type ColorKey = keyof ColorTheme;
