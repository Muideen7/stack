// components/auth/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';
import { AuthBackdrop } from './AuthBackdrop';
import { getTheme } from '../../constants/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  // Phase 1: Mark strata slide in
  const stratum0 = useSharedValue(-100);
  const stratum1 = useSharedValue(100);
  const stratum2 = useSharedValue(-100);
  const markOpacity = useSharedValue(0);

  // Phase 2: Mark lifts up
  const markLift = useSharedValue(0);

  // Phase 3: Wordmark & Tagline
  const wordmarkY = useSharedValue(40);
  const wordmarkOpacity = useSharedValue(0);
  const hairlineScale = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(10);

  // Phase 4: Dissolve out
  const splashOpacity = useSharedValue(1);

  useEffect(() => {
    // 1. Reveal mark
    markOpacity.value = withTiming(1, { duration: 300 });

    // Slabs deal in from alternating sides
    stratum0.value = withSpring(0, { damping: 14, stiffness: 120 });
    stratum1.value = withDelay(120, withSpring(0, { damping: 14, stiffness: 120 }));
    stratum2.value = withDelay(
      240,
      withSpring(0, { damping: 14, stiffness: 120 }, () => {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      })
    );

    // 2. Mark lifts up
    markLift.value = withDelay(
      600,
      withTiming(-28, { duration: 550, easing: Easing.out(Easing.cubic) })
    );

    // 3. Wordmark STACK rises out of baseline
    wordmarkY.value = withDelay(
      700,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    wordmarkOpacity.value = withDelay(700, withTiming(1, { duration: 450 }));

    // Hairline expands
    hairlineScale.value = withDelay(
      900,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
    );

    // Tagline fades in
    taglineOpacity.value = withDelay(1050, withTiming(1, { duration: 450 }));
    taglineY.value = withDelay(
      1050,
      withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) })
    );

    // 4. Hold and exit transition
    splashOpacity.value = withDelay(
      2200,
      withTiming(0, { duration: 500, easing: Easing.inOut(Easing.cubic) }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      })
    );
  }, []);

  const markContainerStyle = useAnimatedStyle(() => ({
    opacity: markOpacity.value,
    transform: [{ translateY: markLift.value }],
  }));

  const stratum0Style = useAnimatedStyle(() => ({
    transform: [{ translateX: stratum0.value }],
  }));

  const stratum1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: stratum1.value }],
  }));

  const stratum2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: stratum2.value }],
  }));

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ translateY: wordmarkY.value }],
  }));

  const hairlineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: hairlineScale.value }],
    opacity: hairlineScale.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));

  const rootStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  const size = 52;
  const w = size;
  const h = (size / 28) * 20;

  return (
    <Animated.View style={[styles.root, rootStyle]}>
      <AuthBackdrop>
        <View style={styles.centerContainer}>
          {/* Animated 3-Slab Stack Mark */}
          <Animated.View style={[styles.markWrapper, markContainerStyle]}>
            <View style={{ width: w, height: h, position: 'relative' }}>
              <Animated.View style={[StyleSheet.absoluteFill, stratum0Style]}>
                <Svg width={w} height={h} viewBox="0 0 28 20" fill="none">
                  <Rect x="0" y="0" width="22" height="4.5" rx="2" fill={theme.accent} fillOpacity={1.0} />
                </Svg>
              </Animated.View>

              <Animated.View style={[StyleSheet.absoluteFill, stratum1Style]}>
                <Svg width={w} height={h} viewBox="0 0 28 20" fill="none">
                  <Rect x="3" y="7.5" width="22" height="4.5" rx="2" fill={theme.accent} fillOpacity={0.75} />
                </Svg>
              </Animated.View>

              <Animated.View style={[StyleSheet.absoluteFill, stratum2Style]}>
                <Svg width={w} height={h} viewBox="0 0 28 20" fill="none">
                  <Rect x="6" y="15" width="22" height="4.5" rx="2" fill={theme.accent} fillOpacity={0.50} />
                </Svg>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Wordmark Container (Clipped Baseline) */}
          <View style={styles.wordmarkClipper}>
            <Animated.Text style={[styles.wordmarkText, { color: theme.ink }, wordmarkStyle]}>
              STACK
            </Animated.Text>
          </View>

          {/* Accent Hairline */}
          <Animated.View style={[styles.hairline, { backgroundColor: theme.accent }, hairlineStyle]} />

          {/* Tagline */}
          <Animated.Text style={[styles.taglineText, { color: theme.ink2 }, taglineStyle]}>
            Every card, one balance.
          </Animated.Text>
        </View>
      </AuthBackdrop>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  wordmarkClipper: {
    height: 52,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  wordmarkText: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  hairline: {
    width: 52,
    height: 2,
    borderRadius: 1,
    marginVertical: 14,
  },
  taglineText: {
    fontSize: 14.5,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
