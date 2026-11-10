// components/auth/OnboardingMotifs.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { PALETTE } from '../../constants/theme';

interface MotifProps {
  active?: boolean;
}

/**
 * Slide 1 Motif: Exact 3 vertical stacked cards from Image 1
 * Back (Titanium Obsidian), Middle (Royal Sapphire), Front (Jewel Emerald) with EMV chips & dots.
 */
export const StackMotif: React.FC<MotifProps> = ({ active = true }) => {
  const lift = useSharedValue(0);

  useEffect(() => {
    if (active) {
      lift.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    } else {
      lift.value = 0;
    }
  }, [active]);

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(active ? 0 : 20, { damping: 15, stiffness: 120 }) }],
    opacity: withTiming(active ? 1 : 0.4, { duration: 300 }),
  }));

  const midStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(active ? 0 : 12, { damping: 15, stiffness: 120 }) }],
    opacity: withTiming(active ? 1 : 0.6, { duration: 300 }),
  }));

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(active ? 0 : 6, { damping: 15, stiffness: 120 }) }],
    opacity: withTiming(active ? 1 : 0.8, { duration: 300 }),
  }));

  return (
    <View style={styles.stackWrapper}>
      {/* Card 1: Back (Titanium Obsidian) */}
      <Animated.View
        style={[
          styles.cardBase,
          styles.backCard,
          backStyle,
          { top: 0, zIndex: 1 },
        ]}
      >
        <View style={styles.chip} />
      </Animated.View>

      {/* Card 2: Middle (Royal Midnight Sapphire) */}
      <Animated.View
        style={[
          styles.cardBase,
          styles.midCard,
          midStyle,
          { top: 38, zIndex: 2 },
        ]}
      >
        <View style={styles.chip} />
      </Animated.View>

      {/* Card 3: Front (Deep Jewel Emerald) */}
      <Animated.View
        style={[
          styles.cardBase,
          styles.frontCard,
          frontStyle,
          { top: 76, zIndex: 3 },
        ]}
      >
        <View style={styles.chip} />
        {/* 4 dots lower-left corner */}
        <View style={styles.dotsRow}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </Animated.View>
    </View>
  );
};

/**
 * Slide 2 Motif: 5-category spending rollup bar matching Image 2
 */
export const SpendingMotif: React.FC<MotifProps> = ({ active = true }) => {
  const categories = [
    { name: 'Groceries', flex: 0.38, color: PALETTE.spending.groceries },
    { name: 'Transfers', flex: 0.27, color: PALETTE.spending.transfers },
    { name: 'Food', flex: 0.13, color: PALETTE.spending.food },
    { name: 'Transport', flex: 0.12, color: PALETTE.spending.transport },
    { name: 'Other', flex: 0.10, color: PALETTE.spending.other },
  ];

  return (
    <View style={styles.spendingWrapper}>
      {/* 5-segment rounded bar */}
      <View style={styles.barContainer}>
        {categories.map((c, i) => (
          <View
            key={c.name}
            style={[
              styles.barSegment,
              {
                flex: c.flex,
                backgroundColor: c.color,
                borderTopLeftRadius: i === 0 ? 10 : 0,
                borderBottomLeftRadius: i === 0 ? 10 : 0,
                borderTopRightRadius: i === categories.length - 1 ? 10 : 0,
                borderBottomRightRadius: i === categories.length - 1 ? 10 : 0,
                marginRight: i < categories.length - 1 ? 2.5 : 0,
              },
            ]}
          />
        ))}
      </View>

      {/* 2-column Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendColumn}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: PALETTE.spending.groceries }]} />
            <Text style={styles.legendLabel}>Groceries</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: PALETTE.spending.food }]} />
            <Text style={styles.legendLabel}>Food</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: PALETTE.spending.other }]} />
            <Text style={styles.legendLabel}>Other</Text>
          </View>
        </View>

        <View style={styles.legendColumn}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: PALETTE.spending.transfers }]} />
            <Text style={styles.legendLabel}>Transfers</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: PALETTE.spending.transport }]} />
            <Text style={styles.legendLabel}>Transport</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

/**
 * Slide 3 Motif: Privacy Card with masked PAN and keyhole lock matching Image 3
 */
export const PrivacyMotif: React.FC<MotifProps> = ({ active = true }) => {
  return (
    <View style={styles.privacyWrapper}>
      <View style={styles.privacyCard}>
        {/* Top-Right: Keyhole Lock Icon */}
        <View style={styles.lockContainer}>
          <Svg width={22} height={26} viewBox="0 0 24 28" fill="none">
            <Path
              d="M12 2C8.686 2 6 4.686 6 8V11H4C2.895 11 2 11.895 2 13V24C2 25.105 2.895 26 4 26H20C21.105 26 22 25.105 22 24V13C22 11.895 21.105 11 20 11H18V8C18 4.686 15.314 2 12 2ZM9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8V11H9V8Z"
              fill="#FFFFFF"
            />
          </Svg>
        </View>

        {/* Card Number Mask */}
        <View style={styles.numberRow}>
          <Text style={styles.dotsText}>••••</Text>
          <Text style={styles.dotsText}>••••</Text>
          <Text style={styles.dotsText}>••••</Text>
          <Text style={styles.tailDigits}>8152</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Stack Motif Styles
  stackWrapper: {
    width: 200,
    height: 236,
    position: 'relative',
    alignSelf: 'center',
    marginVertical: 10,
  },
  cardBase: {
    position: 'absolute',
    width: 200,
    height: 154,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  backCard: {
    backgroundColor: '#0F141C',
  },
  midCard: {
    backgroundColor: '#111D2D',
  },
  frontCard: {
    backgroundColor: '#044331',
    justifyContent: 'space-between',
  },
  chip: {
    width: 20,
    height: 15,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 4.5,
    marginBottom: 2,
  },
  dot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },

  // Spending Motif Styles
  spendingWrapper: {
    width: '100%',
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 35,
  },
  barContainer: {
    width: '100%',
    height: 21,
    flexDirection: 'row',
    borderRadius: 11,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 26,
  },
  barSegment: {
    height: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 56,
    paddingHorizontal: 8,
  },
  legendColumn: {
    gap: 14,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 8.5,
    height: 8.5,
    borderRadius: 4.5,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },

  // Privacy Motif Styles
  privacyWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
  privacyCard: {
    width: 278,
    height: 174,
    borderRadius: 22,
    backgroundColor: '#044331',
    padding: 22,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  lockContainer: {
    alignSelf: 'flex-end',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 12,
  },
  dotsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2.2,
  },
  tailDigits: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
});
