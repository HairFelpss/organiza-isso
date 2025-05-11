export * from "./colors";
export * from "./radius";
export * from "./spacing";
export * from "./typography";

import { Colors } from "./colors";
import { radius } from "./radius";
import { spacing } from "./spacing";
import { typography } from "./typography";

export const theme = {
  colors: Colors,
  typography,
  spacing,
  radius,
} as const;

export type Theme = typeof theme;
