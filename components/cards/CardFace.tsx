// components/cards/CardFace.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Path, G } from 'react-native-svg';
import { Lock } from 'phosphor-react-native';
import { PaymentCard } from '../../types/models';

interface CardFaceProps {
  card: PaymentCard;
  showBalance?: boolean;
  compact?: boolean;
}

interface SkinPalette {
  background: string;
  textColor: string;
  subtextColor: string;
  borderColor: string;
  chipBase: string;
  chipLine: string;
  waveColor: string;
}

const SKIN_PALETTES: Record<string, SkinPalette> = {
  forest: {
    background: '#162F21',
    textColor: '#F5F8F6',
    subtextColor: 'rgba(235, 245, 238, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    chipBase: '#C9D1CB',
    chipLine: '#97A39A',
    waveColor: 'rgba(255, 255, 255, 0.07)',
  },
  moss: {
    background: '#23583C',
    textColor: '#F5F8F6',
    subtextColor: 'rgba(235, 245, 238, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    chipBase: '#C9D1CB',
    chipLine: '#97A39A',
    waveColor: 'rgba(255, 255, 255, 0.08)',
  },
  sage: {
    background: '#557261',
    textColor: '#F5F8F6',
    subtextColor: 'rgba(235, 245, 238, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    chipBase: '#D8DFDA',
    chipLine: '#A2ABA5',
    waveColor: 'rgba(255, 255, 255, 0.09)',
  },
  obsidian: {
    background: '#1B221E',
    textColor: '#F5F8F6',
    subtextColor: 'rgba(235, 245, 238, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    chipBase: '#C4CCC6',
    chipLine: '#8D968F',
    waveColor: 'rgba(255, 255, 255, 0.06)',
  },
  bone: {
    background: '#E2E0D5',
    textColor: '#142018',
    subtextColor: '#5C6A60',
    borderColor: 'rgba(0, 0, 0, 0.08)',
    chipBase: '#C2BCAD',
    chipLine: '#999384',
    waveColor: 'rgba(0, 0, 0, 0.05)',
  },
  volt: {
    background: '#1E2F1A',
    textColor: '#D6FB61',
    subtextColor: '#A5CF44',
    borderColor: '#D6FB61',
    chipBase: '#C9D1CB',
    chipLine: '#97A39A',
    waveColor: 'rgba(214, 251, 97, 0.1)',
  },
  teal: {
    background: '#11352E',
    textColor: '#4EF0C7',
    subtextColor: '#82E4CA',
    borderColor: 'rgba(78, 240, 199, 0.25)',
    chipBase: '#C9D1CB',
    chipLine: '#97A39A',
    waveColor: 'rgba(78, 240, 199, 0.08)',
  },
  slate: {
    background: '#2D3832',
    textColor: '#F5F8F6',
    subtextColor: 'rgba(235, 245, 238, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    chipBase: '#C9D1CB',
    chipLine: '#97A39A',
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
          {/* Contactless waves */}
          <Svg width={12} height={12} viewBox="0 0 16 16" fill="none">
            <Path d="M4 12 C 5.5 10.5, 5.5 5.5, 4 4" stroke={skin.subtextColor} strokeWidth="1.2" strokeLinecap="round" />
            <Path d="M7 13.5 C 9.5 11, 9.5 5, 7 2.5" stroke={skin.subtextColor} strokeWidth="1.2" strokeLinecap="round" />
            <Path d="M10 15 C 13.5 11.5, 13.5 4.5, 10 1" stroke={skin.subtextColor} strokeWidth="1.2" strokeLinecap="round" />
          </Svg>
        </View>

        {/* Card Number */}
        <Text style={[styles.compactNumber, { color: skin.textColor }]}>
          •••• •••• •••• {card.last4}
        </Text>

        {/* Bottom Details */}
        <View style={styles.compactBottomRow}>
          <View>
            <Text style={[styles.compactLabel, { color: skin.subtextColor }]}>CARDHOLDER</Text>
            <Text style={[styles.compactValue, { color: skin.textColor }]} numberOfLines={1}>
              {card.holder}
            </Text>
          </View>

          <View>
            <Text style={[styles.compactLabel, { color: skin.subtextColor }]}>VALID THRU</Text>
            <Text style={[styles.compactValue, { color: skin.textColor }]}>{expiry}</Text>
          </View>

          <Text style={[styles.compactBrand, { color: skin.textColor }]}>
            {brandDisplay}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.fullContainer,
        {
          backgroundColor: skin.background,
          borderColor: skin.borderColor,
          opacity: isFrozen ? 0.7 : 1,
        },
      ]}
    >
      {/* Organic Contour Wave Overlay */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%" viewBox="0 0 340 215" fill="none">
          <Path
            d="M-30 60 C 60 30, 160 80, 370 45"
            stroke={skin.waveColor}
            strokeWidth="1.5"
          />
          <Path
            d="M-30 105 C 70 70, 180 125, 370 80"
            stroke={skin.waveColor}
            strokeWidth="1.5"
          />
          <Path
            d="M-30 150 C 60 120, 170 170, 370 125"
            stroke={skin.waveColor}
            strokeWidth="1.5"
          />
          <Path
            d="M-30 190 C 80 165, 190 205, 370 170"
            stroke={skin.waveColor}
            strokeWidth="1.5"
          />
        </Svg>
      </View>

      {/* Top Row: Stack Mark & Nickname */}
      <View style={styles.fullTopRow}>
        {/* Stack 3-slab mark */}
        <Svg width={26} height={19} viewBox="0 0 28 20" fill="none">
          <Rect x="0" y="0" width="22" height="4.5" rx="2" fill={skin.textColor} />
          <Rect x="3" y="7.5" width="22" height="4.5" rx="2" fill={skin.textColor} fillOpacity="0.75" />
          <Rect x="6" y="15" width="22" height="4.5" rx="2" fill={skin.textColor} fillOpacity="0.5" />
        </Svg>

        <View style={styles.rowAlign}>
          {isFrozen && (
            <View style={styles.frozenBadge}>
              <Lock size={12} color="#D6FB61" weight="fill" />
              <Text style={styles.frozenText}>FROZEN</Text>
            </View>
          )}
          <Text style={[styles.fullNickname, { color: skin.subtextColor }]}>
            {card.nickname || card.brand}
          </Text>
        </View>
      </View>

      {/* Middle: EMV Chip & Contactless waves */}
      <View style={styles.fullChipRow}>
        {/* EMV Chip */}
        <View style={[styles.fullChip, { backgroundColor: skin.chipBase }]}>
          <View style={[styles.chipHorizontalLine, { backgroundColor: skin.chipLine }]} />
          <View style={[styles.chipVerticalLine, { backgroundColor: skin.chipLine }]} />
          <View style={[styles.chipCenterRect, { borderColor: skin.chipLine }]} />
        </View>

        {/* Contactless waves */}
        <Svg width={18} height={18} viewBox="0 0 16 16" fill="none" style={styles.waveIcon}>
          <Path d="M4 12 C 5.5 10.5, 5.5 5.5, 4 4" stroke={skin.subtextColor} strokeWidth="1.5" strokeLinecap="round" />
          <Path d="M7 13.5 C 9.5 11, 9.5 5, 7 2.5" stroke={skin.subtextColor} strokeWidth="1.5" strokeLinecap="round" />
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
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  compactTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactNickname: {
    fontSize: 10,
    fontWeight: '500',
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
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactChipInner: {
    width: 10,
    height: 7,
    borderWidth: 1,
    borderRadius: 1,
  },
  compactNumber: {
    fontSize: 11,
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
    letterSpacing: 0.5,
  },
  compactValue: {
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  compactBrand: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  fullContainer: {
    width: '100%',
    aspectRatio: 1.58,
    borderRadius: 22,
    padding: 20,
    justifyContent: 'space-between',
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 6,
    gap: 4,
  },
  frozenText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D6FB61',
  },
  fullNickname: {
    fontSize: 13,
    fontWeight: '500',
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
    borderRadius: 2,
  },
  waveIcon: {
    marginLeft: 4,
  },
  numberContainer: {
    marginTop: 6,
  },
  fullNumber: {
    fontSize: 16.5,
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
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  fullValue: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  fullBrand: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});

