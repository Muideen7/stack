# Direction: Stack (Precision Vault / Native Sharpened)

## 1. The Brief & Audit

### Problem Statement
The initial implementation inherited Strata's palette which fell squarely into the **"Calm Wellness / Overcorrection"** trap documented in `slop.md`:
- Muddy warm ivory/cream ground (`#F4F3EF` / `#F0EFEA`)
- Murky swamp/olive green (`#204E35` / `#1B3828`)
- Faded dusty sage pills (`#DDE6DE` / `#E2EDE6`)
- In dark mode, an abrupt leap to neon acid lime (`#D6FB61`), hitting the **"Dark Fintech"** trap.

The user explicitly requested an extensive overhaul using the **App Designer** skill bundle to eliminate this muddy color combination and achieve an award-winning aesthetic.

### Refused Defaults (Anti-Slop Audit)
1. **Refused: The Wellness Cream / Swamp Green rut** (`#F4F0EA` ground with `#204E35` dark olive). It looks dingy, lowers text legibility, and feels like an unwashed herbal tea brand.
2. **Refused: The Dark Fintech Lime rut** (`#000000` with `#D4F45A` neon lime). Overused by generic crypto apps since 2023.
3. **Refused: Indiscriminate 5-shade green charts** (having 5 spending categories all be slightly different shades of swamp green).
4. **Refused: Unexamined grey `#888888`**. All neutrals are tinted 3% towards cool slate/ink to harmonize with the architectural ground.

---

## 2. Three-Direction Exploration

| Direction | Concept Sentence | Ground | Ink | Signature Accent | Richness Source |
|---|---|---|---|---|---|
| **A. Precision Vault (Native Sharpened)** *(Selected)* | Stack is an architect's titanium cardholder and private vault. | Pure Porcelain (`#F8F9FA` / `#FFFFFF`) / OLED Obsidian (`#090A0E`) | Deep Carbon (`#0B0E14`) / Snow (`#F8FAFC`) | **Imperial Emerald** (`#047857` light / `#10B981` dark) | Tactile Physical Card Materials (Titanium, Emerald Silk, Royal Sapphire, Platinum Bone) |
| **B. Onyx Monolith (Instrument)** | Stack is a precision aerospace flight computer for wealth. | True Carbon Monolith (`#050608`) | High-Luminance White (`#FFFFFF`) | Cyber Cobalt (`#2563EB`) | Guilloche micro-grids, laser-etched telemetry figures |
| **C. Nordic Mineral (Architectural)** | Stack is a polished granite and arctic glass gallery. | Arctic Ice Mist (`#F1F5F9`) | Graphite Ink (`#1E293B`) | Nordic Amber (`#D97706`) | Frosted translucent mineral slabs and monolithic layout |

**Decision:** Direction **A (Precision Vault)** is selected. It honors the user's desire for a refined, modern financial interface with tactile luxury card objects, crisp porcelain ground, deep carbon contrast, and an authoritative Imperial Emerald accent that meets WCAG AAA standards.

---

## 3. The 9 Token Roles (System Architecture)

| Token | Role | Light Mode Value | Dark Mode Value | Contrast Ratio |
|---|---|---|---|---|
| `ground` | Canvas background | `#F8F9FA` (Architectural Porcelain) | `#090A0E` (OLED Obsidian) | 15:1 against ink |
| `raised` | Elevated cards, sheets, grouped containers | `#FFFFFF` (Pure Crisp White) | `#13171F` (Dark Titanium Surface) | Distinct from ground |
| `raised-subtle` | Recessed inputs, keypad keys, chip containers | `#F1F3F5` (Subtle Mineral) | `#1A202C` (Deep Mineral) | Clear hierarchy |
| `ink` | Primary text, titles, hero amounts | `#0B0E14` (Deep Carbon) | `#F8FAFC` (Snow White) | $\ge 14:1$ |
| `ink-2` | Secondary text, subtitles, category meta | `#475569` (Tinted Cool Slate) | `#94A3B8` (Muted Sterling) | $\ge 4.8:1$ |
| `ink-3` | Tertiary text, cardholder labels, timestamps | `#8C96A5` (Subtle Slate) | `#64748B` (Deep Slate) | $\ge 3:1$ |
| `rule` | Hairline borders and dividers | `rgba(15, 23, 42, 0.08)` | `rgba(255, 255, 255, 0.08)` | Crisp 0.5-1px separation |
| `accent` | Primary CTA, verification, active tab pill | `#047857` (Imperial Emerald) | `#10B981` (Luminous Emerald) | $\ge 5.2:1$ on ground |
| `on-accent` | Text & glyphs on accent buttons | `#FFFFFF` | `#062E20` | $\ge 6:1$ |
| `positive` | Inflow amounts, verified status | `#059669` (Jewel Green) | `#34D399` (Luminous Jade) | Distinct from spend |
| `negative` | Outflow amounts, card frozen alert | `#DC2626` (Ruby Crimson) | `#F87171` (Luminous Coral) | High-urgency alert |

---

## 4. Card Materials (Physical Tactility)

Rather than rendering flat muddy cards, each card in Stack is a bespoke material:
1. **Titanium Obsidian**: `#0D1117` to `#161B22` with platinum foil typography and Mastercard hologram luster.
2. **Imperial Emerald Silk**: `#044E39` to `#022B1F` with fine guilloche micro-lines and gold leaf foil typography.
3. **Royal Sapphire**: `#0F172A` to `#1E3A8A` with silver debossing and Visa hologram luster.
4. **Platinum Frost**: `#F1F5F9` to `#E2E8F0` with brushed graphite ink and silver Amex foil.

---

## 5. Signature Interaction & Navigation
- **Liquid Glass Tab Bar**: Floating frosted glass capsule with subtle backdrop blur, hairline border, and a responsive active pill that glides with spring physics.
- **Haptic Tactility**: Selection clicks on card toggles, light impacts on quick actions, and success notifications on critical operations.
- **FrontendGeek Identity**: Standardized across user profile (`@frontendgeek`, `frontendgeek@stack.app`, cardholder `FRONTENDGEEK`).
