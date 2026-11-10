// app/(auth)/onboarding.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';
import { useAuthStore } from '../../store/authStore';
import { AuthBackdrop } from '../../components/auth/AuthBackdrop';
import { StackMark } from '../../components/common/StackMark';
import {
  StackMotif,
  SpendingMotif,
  PrivacyMotif,
} from '../../components/auth/OnboardingMotifs';
import { getTheme } from '../../constants/theme';

const SLIDES = [
  {
    eyebrow: 'EVERYTHING IN ONE PLACE',
    title: 'Every card,\none balance',
    body: 'Stack gathers your cards into a single wallet and keeps the running total honest, down to the cent.',
  },
  {
    eyebrow: 'KNOW WHERE IT WENT',
    title: 'Spending that\nexplains itself',
    body: 'One bar, five categories, no guesswork. See the week at a glance instead of scrolling a ledger.',
  },
  {
    eyebrow: 'BUILT TO BE CAREFUL',
    title: 'Your numbers\nnever stored',
    body: 'Card numbers and security codes are never written to disk. Only the last four digits ever leave the keypad.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  const { setOnboardingCompleted } = useAuthStore();
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;
  const current = SLIDES[index];

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isLast) {
      setOnboardingCompleted(true);
      router.replace('/(auth)/sign-in');
    } else {
      setIndex((i) => i + 1);
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingCompleted(true);
    router.replace('/(auth)/sign-in');
  };

  return (
    <AuthBackdrop>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Top Header: Official Stack Brand Logo (Left) + Skip (Right) */}
        <View style={styles.header}>
          <StackMark size={28} color={theme.accent} />

          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: theme.accent }]}>Skip</Text>
          </Pressable>
        </View>

        {/* Motif Illustration Area */}
        <View style={styles.motifContainer}>
          {index === 0 && <StackMotif />}
          {index === 1 && <SpendingMotif />}
          {index === 2 && <PrivacyMotif />}
        </View>

        {/* Copy Section */}
        <View style={styles.copyContainer}>
          <Text style={[styles.eyebrow, { color: theme.accent }]}>{current.eyebrow}</Text>
          <Text style={[styles.title, { color: theme.ink }]}>{current.title}</Text>
          <Text style={[styles.body, { color: theme.ink2 }]}>{current.body}</Text>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomContainer}>
          {/* Segmented Progress Bars */}
          <View style={styles.progressRow}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressTrack,
                  { backgroundColor: theme.rule },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: i <= index ? theme.accent : 'transparent',
                    },
                  ]}
                />
              </View>
            ))}
          </View>

          {/* Continue / Get Started CTA */}
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.ctaButton,
              {
                backgroundColor: theme.accent,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
          >
            <Text style={[styles.ctaText, { color: theme.onAccent }]}>
              {isLast ? 'Get started' : 'Continue'}
            </Text>
          </Pressable>

          <Text style={[styles.subtext, { color: theme.ink3 }]}>No account needed to look around.</Text>
        </View>
      </SafeAreaView>
    </AuthBackdrop>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '700',
  },
  motifContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyContainer: {
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    letterSpacing: -0.1,
  },
  bottomContainer: {
    paddingBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  progressTrack: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  ctaButton: {
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtext: {
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 12,
  },
});
