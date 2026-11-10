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

interface MotifProps {
  active: boolean;
}

/**
 * Slide 1 Motif: Exact 3 vertical stacked cards from Image 1
 * Back (Sage), Middle (Moss), Front (Deep Forest) with silver EMV chips & dots.
 */
export const StackMotif: React.FC<MotifProps> = ({ active }) => {
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
      {/* Card 1: Back (Sage) */}
      <Animated.View
        style={[
          styles.cardBase,
          styles.sageCard,
          backStyle,
          { top: 0, zIndex: 1 },
        ]}
      >
        <View style={styles.chip} />
      </Animated.View>

      {/* Card 2: Middle (Moss) */}
      <Animated.View
        style={[
          styles.cardBase,
          styles.mossCard,
          midStyle,
          { top: 38, zIndex: 2 },
        ]}
      >
        <View style={styles.chip} />
      </Animated.View>

      {/* Card 3: Front (Deep Forest) */}
      <Animated.View
        style={[
          styles.cardBase,
          styles.forestCard,
          frontStyle,
          { top: 76, zIndex: 3 },
        ]}
      >
        <View style={styles.chip} />
        {/* Embossed dots bottom left */}
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
 * Slide 2 Motif: Exact 5-segment spending bar with 2-column legend from Image 2
 */
export const SpendingMotif: React.FC<MotifProps> = ({ active }) => {
  const barWidth = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    barWidth.value = withTiming(active ? 1 : 0, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [active]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: withSpring(active ? 1 : 0.85, { damping: 14 }) }],
    opacity: withTiming(active ? 1 : 0.3, { duration: 300 }),
  }));

  return (
    <View style={styles.spendingWrapper}>
      {/* 5-segment pill bar */}
      <Animated.View style={[styles.barContainer, animatedBarStyle]}>
        <View style={[styles.barSegment, { width: '35%', backgroundColor: '#1E4331', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }]} />
        <View style={[styles.barSegment, { width: '25%', backgroundColor: '#2C5E44' }]} />
        <View style={[styles.barSegment, { width: '18%', backgroundColor: '#3E7E5E' }]} />
        <View style={[styles.barSegment, { width: '12%', backgroundColor: '#5F9E7E' }]} />
        <View style={[styles.barSegment, { width: '10%', backgroundColor: '#8BC2A6', borderTopRightRadius: 10, borderBottomRightRadius: 10 }]} />
      </Animated.View>

      {/* Two-column category list */}
      <View style={styles.legendContainer}>
        {/* Left Column */}
        <View style={styles.legendColumn}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#1E4331' }]} />
            <Text style={styles.legendLabel}>Groceries</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#3E7E5E' }]} />
            <Text style={styles.legendLabel}>Food</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#8BC2A6' }]} />
            <Text style={styles.legendLabel}>Other</Text>
          </View>
        </View>

        {/* Right Column */}
        <View style={styles.legendColumn}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#2C5E44' }]} />
            <Text style={styles.legendLabel}>Transfers</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#5F9E7E' }]} />
            <Text style={styles.legendLabel}>Transport</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

/**
 * Slide 3 Motif: Exact single privacy card with lock & dots from Image 3
 */
export const PrivacyMotif: React.FC<MotifProps> = ({ active }) => {
  return (
    <View style={styles.privacyWrapper}>
      <View style={styles.privacyCard}>
        {/* Closed padlock at top right */}
        <View style={styles.lockContainer}>
          <Svg width={18} height={22} viewBox="0 0 18 22" fill="none">
            {/* Shackle */}
            <Path
              d="M 4 10 V 5 C 4 2.2 6.2 0 9 0 C 11.8 0 14 2.2 14 5 V 10"
              stroke="#FFFFFF"
              strokeWidth={2.4}
              strokeLinecap="round"
            />
            {/* Body */}
            <Path
              d="M 1 10 H 17 C 17.5 10 18 10.5 18 11 V 21 C 18 21.5 17.5 22 17 22 H 1 C 0.5 22 0 21.5 0 21 V 11 C 0 10.5 0.5 10 1 10 Z"
              fill="#FFFFFF"
            />
          </Svg>
        </View>

        {/* Centered Masked Number */}
        <View style={styles.numberRow}>
          <Text style={styles.dotsText}>
            • • • • • • • • • • • •
          </Text>
          <Text style={styles.tailDigits}>
            4 2 4 2
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Stack Motif Styles
  stackWrapper: {
    width: 236,
    height: 226,
    alignSelf: 'center',
    position: 'relative',
    marginTop: 10,
    marginBottom: 20,
  },
  cardBase: {
    width: 236,
    height: 148,
    borderRadius: 16,
    padding: 14,
    position: 'absolute',
    left: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  sageCard: {
    backgroundColor: '#586E5E',
  },
  mossCard: {
    backgroundColor: '#275239',
  },
  forestCard: {
    backgroundColor: '#162C21',
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
    backgroundColor: '#E5E4DE',
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
    color: '#1A241E',
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
    borderRadius: 20,
    backgroundColor: '#162C21',
    padding: 22,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 10,
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
