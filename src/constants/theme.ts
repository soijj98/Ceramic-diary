import { StepType } from "@/types";

// Palette drawn from the material itself: raw stoneware, bisque,
// wet clay, and the blue-grey of a cooling kiln — rather than a
// generic warm-neutral UI palette.
export const colors = {
  background: "#EFEAE1", // unfired bisque
  surface: "#FFFFFF",
  surfaceMuted: "#E3DACB", // dry clay body
  text: "#332C24",
  textMuted: "#7A6F60",
  border: "#D9CFBE",
  accent: "#7A5C42", // wet stoneware brown
  accentMuted: "#B99C7B",
  kiln: "#8C4A3B", // firing / heat
  glaze: "#3E5C63", // glaze blue-grey
  danger: "#A33B2E",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
};

// A small accent color per step type, used for badges and timeline
// markers so the process reads visually at a glance.
export const stepTypeColor: Record<StepType, string> = {
  muotoilu: colors.accent,
  kuivatus: colors.accentMuted,
  raakapoltto: colors.kiln,
  enkoopointi: colors.glaze,
  lasitus: colors.glaze,
  lasipoltto: colors.kiln,
  muu: colors.textMuted,
};
