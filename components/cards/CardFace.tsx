// components/cards/CardFace.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Lock } from 'phosphor-react-native';
import { PaymentCard } from '../../types/models';

interface CardFaceProps {
  card: PaymentCard;
  showBalance?: boolean;
  compact?: boolean;
}

interface SkinPalette {
  background: string;
  gradientStart: string;
  gradientEnd: string;
  textColor: string;
  subtextColor: string;
  borderColor: string;
  chipBase: string;
  chipLine: string;
  waveColor: string;
}

const SKIN_PALETTES: Record<string, SkinPalette> = {
  // Titanium Obsidian / Deep Emerald Dark
  forest: {
    background: '#0D1612',
    gradientStart: '#13211B',
    gradientEnd: '#09100C',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(240, 245, 242, 0.70)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    chipBase: '#D1D7D3',
    chipLine: '#8F9B93',
    waveColor: 'rgba(255, 255, 255, 0.08)',
  },
  // Deep Jewel Emerald Silk
  moss: {
    background: '#044331',
    gradientStart: '#065740',
    gradientEnd: '#022C20',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(235, 248, 242, 0.72)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    chipBase: '#D8DFDA',
    chipLine: '#94A398',
    waveColor: 'rgba(255, 255, 255, 0.09)',
  },
  // Royal Midnight Sapphire / Cobalt
  sage: {
    background: '#111D2D',
    gradientStart: '#1A293E',
    gradientEnd: '#0A121D',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(240, 245, 255, 0.70)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    chipBase: '#CBD5E1',
    chipLine: '#94A3B8',
    waveColor: 'rgba(255, 255, 255, 0.08)',
  },
  // Obsidian Monolith
  obsidian: {
    background: '#0C0E12',
    gradientStart: '#161920',
    gradientEnd: '#07080B',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(240, 243, 246, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    chipBase: '#CBD5E1',
    chipLine: '#94A3B8',
    waveColor: 'rgba(255, 255, 255, 0.07)',
  },
  // Brushed Platinum Frost
  bone: {
    background: '#ECEFF2',
    gradientStart: '#F8FAFC',
    gradientEnd: '#E2E8F0',
    textColor: '#0B0E14',
    subtextColor: '#475569',
    borderColor: 'rgba(15, 23, 42, 0.10)',
    chipBase: '#CBD5E1',
    chipLine: '#94A3B8',
    waveColor: 'rgba(15, 23, 42, 0.06)',
  },
  // Midnight Amber / Gold
  volt: {
    background: '#1F1A12',
    gradientStart: '#2A2417',
    gradientEnd: '#141009',
    textColor: '#FDE68A',
    subtextColor: 'rgba(253, 230, 138, 0.70)',
    borderColor: 'rgba(251, 191, 36, 0.25)',
    chipBase: '#FCD34D',
    chipLine: '#B45309',
    waveColor: 'rgba(251, 191, 36, 0.08)',
  },
  // Deep Petrol Teal
  teal: {
    background: '#082527',
    gradientStart: '#0D383B',
    gradientEnd: '#051819',
    textColor: '#E0F2FE',
    subtextColor: 'rgba(224, 242, 254, 0.70)',
    borderColor: 'rgba(56, 189, 248, 0.20)',
    chipBase: '#BAE6FD',
    chipLine: '#0284C7',
    waveColor: 'rgba(56, 189, 248, 0.08)',
  },
  // Precision Slate
  slate: {
    background: '#1E2530',
    gradientStart: '#273140',
    gradientEnd: '#151A22',
    textColor: '#FFFFFF',
    subtextColor: 'rgba(226, 232, 240, 0.70)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    chipBase: '#CBD5E1',
    chipLine: '#94A3B8',
    waveColor: 'rgba(255, 255, 255, 0.07)',
  },
};

export const CardFace: React.FC<CardFaceProps> = ({ card, compact = false }) => {
  const skin = SKIN_PALETTES[card.skin] || SKIN_PALETTES.forest;
  const isFrozen = card.frozen;
  const expiry = `${String(card.expiryMonth).padStart(2, '0')}/${String(card.expiryYear).slice(-2)}`;
  const brandDisplay = (card.brand || 'Mastercard').toUpperCase();

  if (compact) {
    return (
      <View
        style={[
          styles.compactContainer,
          {
            backgroundColor: skin.background,
            borderColor: skin.borderColor,
            opacity: isFrozen ? 0.7 : 1,
          },
        ]}
      >
        {/* Subtle contour lines */}
        <View style={StyleSheet.absoluteFill}>
          <Svg width="100%" height="100%" viewBox="0 0 200 125" fill="none">
            <Path
              d="M-20 40 C 40 20, 100 50, 220 30"
              stroke={skin.waveColor}
              strokeWidth="1.2"
            />
            <Path
              d="M-20 65 C 50 45, 120 75, 220 50"
              stroke={skin.waveColor}
              strokeWidth="1.2"
            />
            <Path
              d="M-20 90 C 40 75, 110 100, 220 80"
              stroke={skin.waveColor}
              strokeWidth="1.2"
            />
          </Svg>
        </View>

        {/* Top Header */}
        <View style={styles.compactTopRow}>
          {/* Stack 3-slab mark */}
          <Svg width={18} height={13} viewBox="0 0 28 20" fill="none">
            <Rect x="0" y="0" width="22" height="4.5" rx="2" fill={skin.textColor} />
            <Rect x="3" y="7.5" width="22" height="4.5" rx="2" fill={skin.textColor} fillOpacity="0.75" />
            <Rect x="6" y="15" width="22" height="4.5" rx="2" fill={skin.textColor} fillOpacity="0.5" />
          </Svg>

          <Text
            style={[styles.compactNickname, { color: skin.subtextColor }]}
            numberOfLines={1}
          >
            {card.nickname || card.brand}
          </Text>
        </View>

        {/* Chip & waves */}
        <View style={styles.compactChipRow}>
          <View style={[styles.compactChip, { backgroundColor: skin.chipBase }]}>
            <View style={[styles.compactChipInner, { borderColor: skin.chipLine }]} />
          </View>
          <Svg width={10} height={10} viewBox="0 0 16 16" fill="none">
            <Path d="M4 11 C 6 9, 6 5, 4 3" stroke={skin.subtextColor} strokeWidth="1.6" strokeLinecap="round" />
            <Path d="M7 13 C 9.5 10.5, 9.5 3.5, 7 1" stroke={skin.subtextColor} strokeWidth="1.6" strokeLinecap="round" />
          </Svg>
        </View>

        {/* Compact Number */}
        <Text style={[styles.compactNumber, { color: skin.textColor }]}>
          •••• {card.last4}
        </Text>

        {/* Bottom Row */}
        <View style={styles.compactBottomRow}>
          <View>
            <Text style={[styles.compactLabel, { color: skin.subtextColor }]}>CARDHOLDER</Text>
            <Text style={[styles.compactValue, { color: skin.textColor }]} numberOfLines={1}>
              {card.holder}
            </Text>
          </View>
          <View>
            <Text style={[styles.compactLabel, { color: skin.subtextColor }]}>EXPIRES</Text>
            <Text style={[styles.compactValue, { color: skin.textColor }]}>{expiry}</Text>
          </View>
          <Text style={[styles.compactBrand, { color: skin.textColor }]}>
            {brandDisplay}
          </Text>
        </View>
      </View>
    );
  }

  // Full-size Card View
  return (
    <View
      style={[
        styles.fullContainer,
        {
          backgroundColor: skin.background,
          borderColor: skin.borderColor,
          opacity: isFrozen ? 0.75 : 1,
        },
      ]}
    >
      {/* Background Micro-Wave Contours */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%" viewBox="0 0 340 215" fill="none">
          <Path
            d="M-30 65 C 60 30, 160 85, 370 50"
            stroke={skin.waveColor}
            strokeWidth="1.5"
          />
          <Path
            d="M-30 110 C 70 80, 190 130, 370 90"
            stroke={skin.waveColor}
            strokeWidth="1.5"
          />
          <Path
            d="M-30 155 C 60 130, 180 175, 370 135"
            stroke={skin.waveColor}
            strokeWidth="1.5"
          />
          <Path
            d="M-30 195 C 80 170, 200 215, 370 175"
            stroke={skin.waveColor}
            strokeWidth="1.5"
          />
        </Svg>
      </View>

      {/* Top Row: Stack Mark + Nickname + Frozen Indicator */}
      <View style={styles.fullTopRow}>
        <View style={styles.rowAlign}>
          <Svg width={26} height={19} viewBox="0 0 28 20" fill="none">
            <Rect x="0" y="0" width="22" height="4.5" rx="2" fill={skin.textColor} />
            <Rect x="3" y="7.5" width="22" height="4.5" rx="2" fill={skin.textColor} fillOpacity="0.75" />
            <Rect x="6" y="15" width="22" height="4.5" rx="2" fill={skin.textColor} fillOpacity="0.5" />
          </Svg>
        </View>

        <View style={styles.rowAlign}>
          {isFrozen && (
            <View style={styles.frozenBadge}>
              <Lock size={12} color="#F87171" weight="bold" />
              <Text style={styles.frozenText}>FROZEN</Text>
            </View>
          )}
          <Text style={[styles.fullNickname, { color: skin.subtextColor }]}>
            {card.nickname || card.brand}
          </Text>
        </View>
      </View>

      {/* EMV Chip & Contactless wave */}
      <View style={styles.fullChipRow}>
        <View style={[styles.fullChip, { backgroundColor: skin.chipBase }]}>
          <View style={[styles.chipHorizontalLine, { backgroundColor: skin.chipLine }]} />
          <View style={[styles.chipVerticalLine, { backgroundColor: skin.chipLine }]} />
          <View style={[styles.chipCenterRect, { borderColor: skin.chipLine }]} />
        </View>

        {/* Contactless waves */}
        <Svg width={18} height={18} viewBox="0 0 16 16" fill="none" style={styles.waveIcon}>
          <Path d="M4 11 C 6 9, 6 5, 4 3" stroke={skin.subtextColor} strokeWidth="1.5" strokeLinecap="round" />
          <Path d="M7 13 C 9.5 11, 9.5 5, 7 2.5" stroke={skin.subtextColor} strokeWidth="1.5" strokeLinecap="round" />
          <Path d="M10 15 C 13.5 11.5, 13.5 4.5, 10 1" stroke={skin.subtextColor} strokeWidth="1.5" strokeLinecap="round" />
        </Svg>
      </View>

      {/* Card Number */}
      <View style={styles.numberContainer}>
        <Text style={[styles.fullNumber, { color: skin.textColor }]}>
          •••• •••• •••• {card.last4}
        </Text>
      </View>

      {/* Bottom Row: Holder, Expiry & Network */}
      <View style={styles.fullBottomRow}>
        <View style={{ flex: 1.4 }}>
          <Text style={[styles.fullLabel, { color: skin.subtextColor }]}>CARDHOLDER</Text>
          <Text style={[styles.fullValue, { color: skin.textColor }]} numberOfLines={1}>
            {card.holder}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.fullLabel, { color: skin.subtextColor }]}>VALID THRU</Text>
          <Text style={[styles.fullValue, { color: skin.textColor }]}>{expiry}</Text>
        </View>

        <View style={{ alignItems: 'flex-end', flex: 1.2 }}>
          <Text style={[styles.fullBrand, { color: skin.textColor }]}>
            {brandDisplay}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  compactContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    padding: 12,
    justifyContent: 'space-between',
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  compactTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactNickname: {
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  compactChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  compactChip: {
    width: 20,
    height: 15,
    borderRadius: 3.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactChipInner: {
    width: 10,
    height: 7,
    borderWidth: 1,
    borderRadius: 1.5,
  },
  compactNumber: {
    fontSize: 11.5,
    fontFamily: 'monospace',
    fontWeight: '600',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  compactBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  compactLabel: {
    fontSize: 6.5,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  compactValue: {
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  compactBrand: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  fullContainer: {
    width: '100%',
    aspectRatio: 1.586,
    borderRadius: 22,
    padding: 20,
    justifyContent: 'space-between',
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 8,
  },
  fullTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frozenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
    marginRight: 8,
    gap: 4,
  },
  frozenText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FCA5A5',
    letterSpacing: 0.5,
  },
  fullNickname: {
    fontSize: 13.5,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  fullChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  fullChip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  chipHorizontalLine: {
    width: '100%',
    height: 1,
    position: 'absolute',
  },
  chipVerticalLine: {
    height: '100%',
    width: 1,
    position: 'absolute',
  },
  chipCenterRect: {
    width: 18,
    height: 14,
    borderWidth: 1,
    borderRadius: 2.5,
  },
  waveIcon: {
    marginLeft: 4,
  },
  numberContainer: {
    marginTop: 6,
  },
  fullNumber: {
    fontSize: 17,
    fontFamily: 'monospace',
    fontWeight: '600',
    letterSpacing: 2.2,
  },
  fullBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  fullLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: 2,
  },
  fullValue: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  fullBrand: {
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
