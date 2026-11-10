// app/(auth)/onboarding.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { useAuthStore } from '../../store/authStore';
import { AuthBackdrop } from '../../components/auth/AuthBackdrop';
import { StackMark } from '../../components/common/StackMark';
import {
  StackMotif,
  SpendingMotif,
  PrivacyMotif,
} from '../../components/auth/OnboardingMotifs';

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
        {/* Top Header: Logo on Left & Skip on Right */}
        <View style={styles.headerRow}>
          <StackMark size={28} color="#203E2B" />

          <Pressable onPress={handleSkip} hitSlop={12} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* Center Artwork Area */}
        <View style={styles.motifContainer}>
          {index === 0 && <StackMotif active={index === 0} />}
          {index === 1 && <SpendingMotif active={index === 1} />}
          {index === 2 && <PrivacyMotif active={index === 2} />}
        </View>

        {/* Copy Section */}
        <View style={styles.copyContainer}>
          <Text style={styles.eyebrow}>{current.eyebrow}</Text>
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.body}>{current.body}</Text>
        </View>

        {/* Bottom Section: Progress + CTA + Subtext */}
        <View style={styles.bottomContainer}>
          {/* 3-segment progress indicator */}
          <View style={styles.progressRow}>
            {SLIDES.map((_, i) => (
              <Pressable
                key={i}
                onPress={() => setIndex(i)}
                style={styles.progressTrack}
              >
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: i <= index ? '#204E35' : '#D6D5CE' },
                  ]}
                />
              </Pressable>
            ))}
          </View>

          {/* Primary Action Button */}
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.ctaButton,
              { opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Text style={styles.ctaText}>
              {isLast ? 'Get started' : 'Continue'}
            </Text>
          </Pressable>

          {/* Subtext */}
          <Text style={styles.subtext}>No account needed to look around.</Text>
        </View>
      </SafeAreaView>
    </AuthBackdrop>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#204E35',
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
    color: '#24563B',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0E1A13',
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    color: '#414D45',
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
    backgroundColor: '#D6D5CE',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  ctaButton: {
    backgroundColor: '#204E35',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1B3E2B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtext: {
    fontSize: 12.5,
    color: '#6E7871',
    textAlign: 'center',
    marginTop: 12,
  },
});
