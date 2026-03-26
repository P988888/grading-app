export const Colors = {
  light: {
    textPrimary: "#1C1917",
    textSecondary: "#78716c",
    textMuted: "#9CA3AF",
    primary: "#6C63FF", // 薰衣草紫 - 科技与智能
    accent: "#896BFF", // 紫色渐变终点
    success: "#00B894", // 翠绿色
    error: "#FF6B6B",
    backgroundRoot: "#F0F0F3", // 暖灰白 - 柔和卡片风
    backgroundDefault: "#F0F0F3", // 卡片背景与根背景同色
    backgroundTertiary: "#E8E8EB", // 凹陷面颜色
    buttonPrimaryText: "#FFFFFF",
    tabIconSelected: "#6C63FF",
    border: "#D1D9E6",
    borderLight: "#E8E8EB",
  },
  dark: {
    textPrimary: "#2D3436",
    textSecondary: "#636E72",
    textMuted: "#B2BEC3",
    primary: "#6C63FF", // 薰衣草紫
    accent: "#896BFF",
    success: "#00B894",
    error: "#FF6B6B",
    backgroundRoot: "#F0F0F3", // 统一使用暖灰白背景
    backgroundDefault: "#F0F0F3",
    backgroundTertiary: "#E8E8EB",
    buttonPrimaryText: "#FFFFFF",
    tabIconSelected: "#6C63FF",
    border: "#D1D9E6",
    borderLight: "#E8E8EB",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 112,
    lineHeight: 112,
    fontWeight: "200" as const,
    letterSpacing: -4,
  },
  displayLarge: {
    fontSize: 112,
    lineHeight: 112,
    fontWeight: "200" as const,
    letterSpacing: -2,
  },
  displayMedium: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "200" as const,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "300" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  smallMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  captionMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
  },
  labelTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700" as const,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  stat: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "300" as const,
  },
  tiny: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "400" as const,
  },
  navLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "500" as const,
  },
};

export type Theme = typeof Colors.light;
