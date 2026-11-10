// constants/theme.ts
/**
 * App Designer Design Tokens for Stack
 * Based on DIRECTION.md (Precision Vault / Native Sharpened)
 */

export const PALETTE = {
  // Light Mode Tokens
  light: {
    ground: '#F8F9FA',           // Pure Architectural Porcelain
    raised: '#FFFFFF',           // Crisp White Card / Sheet Surface
    raisedSubtle: '#F1F3F5',     // Keypad keys, subtle button pills, container backgrounds
    ink: '#0B0E14',              // Deep Carbon Black (14:1 contrast)
    ink2: '#475569',             // Tinted Cool Slate (4.8:1 contrast)
    ink3: '#8C96A5',             // Tertiary Slate (3:1 contrast)
    rule: 'rgba(15, 23, 42, 0.08)', // Crisp hairline border
    ruleSubtle: 'rgba(15, 23, 42, 0.04)',
    accent: '#047857',           // Imperial Emerald CTA / Active Pill
    accentPressed: '#065F46',    // Darkened on press
    accentSoft: 'rgba(4, 120, 87, 0.10)', // Subtle emerald tint
    onAccent: '#FFFFFF',         // Crisp White text on Accent
    positive: '#059669',         // Jewel Green (+ inflows)
    negative: '#DC2626',         // Ruby Crimson (- outflows)
    navBackground: 'rgba(255, 255, 255, 0.92)',
    navBorder: 'rgba(15, 23, 42, 0.08)',
  },

  // Dark Mode Tokens (OLED Precision)
  dark: {
    ground: '#090A0E',           // OLED Obsidian Ground
    raised: '#13171F',           // Dark Titanium Surface
    raisedSubtle: '#1C222D',     // Recessed inputs / Keypad keys
    ink: '#F8FAFC',              // Snow White
    ink2: '#94A3B8',             // Muted Sterling
    ink3: '#64748B',             // Deep Slate
    rule: 'rgba(255, 255, 255, 0.08)', // Crisp white hairline
    ruleSubtle: 'rgba(255, 255, 255, 0.04)',
    accent: '#10B981',           // Luminous Jewel Emerald
    accentPressed: '#059669',    // Pressed state
    accentSoft: 'rgba(16, 185, 129, 0.15)', // Luminous emerald wash
    onAccent: '#062E20',         // Deep forest contrast on luminous emerald
    positive: '#34D399',         // Luminous Jade (+ inflows)
    negative: '#F87171',         // Coral Red (- outflows)
    navBackground: 'rgba(19, 23, 31, 0.92)',
    navBorder: 'rgba(255, 255, 255, 0.08)',
  },

  // Distinct Spending Categories (Balanced and distinguishable)
  spending: {
    groceries: '#047857',        // Emerald
    transfers: '#2563EB',        // Cobalt
    food: '#D97706',             // Warm Amber
    transport: '#7C3AED',        // Amethyst
    other: '#64748B',            // Cool Slate
  },
};

export type ThemeColors = typeof PALETTE.light;

export function getTheme(isDark: boolean): ThemeColors {
  return isDark ? PALETTE.dark : PALETTE.light;
}
