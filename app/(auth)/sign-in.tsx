// app/(auth)/sign-in.tsx
import * as Haptics from '@/utils/haptics';
import { useRouter } from 'expo-router';
import { AppleLogo, EnvelopeSimple, GoogleLogo, LockSimple } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

import { AuthBackdrop } from '../../components/auth/AuthBackdrop';
import { AuthBanner } from '../../components/auth/AuthBanner';
import { AuthField } from '../../components/auth/AuthField';
import { StackMark } from '../../components/common/StackMark';
import { useAuthStore } from '../../store/authStore';
import { getTheme } from '../../constants/theme';

export default function SignInScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  const { setAuthenticated } = useAuthStore();

  const [email, setEmail] = useState('demo@stack.app');
  const [password, setPassword] = useState('stack2026');

  const handleSignIn = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/(auth)/pin');
  };

  const handleSocialAuth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/pin');
  };

  return (
    <AuthBackdrop>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Top Header: Logo on Right */}
        <View style={styles.headerRow}>
          <View />
          <StackMark size={28} color={theme.accent} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Copy */}
          <View style={styles.titleSection}>
            <Text style={[styles.eyebrow, { color: theme.accent }]}>WELCOME BACK</Text>
            <Text style={[styles.title, { color: theme.ink }]}>Sign in to Stack</Text>
            <Text style={[styles.subtitle, { color: theme.ink2 }]}>Your wallet, exactly where you left it.</Text>
          </View>

          {/* Social Auth Buttons */}
          <View style={styles.socialGroup}>
            <Pressable
              onPress={handleSocialAuth}
              style={[styles.appleButton, { backgroundColor: isDark ? '#FFFFFF' : '#000000' }]}
            >
              <AppleLogo size={19} color={isDark ? '#000000' : '#FFFFFF'} weight="fill" />
              <Text style={[styles.appleButtonText, { color: isDark ? '#000000' : '#FFFFFF' }]}>
                Sign in with Apple
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSocialAuth}
              style={[
                styles.googleButton,
                {
                  backgroundColor: theme.raised,
                  borderColor: theme.rule,
                },
              ]}
            >
              <GoogleLogo size={19} color={theme.ink} weight="bold" />
              <Text style={[styles.googleButtonText, { color: theme.ink }]}>
                Sign in with Google
              </Text>
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: theme.rule }]} />
            <Text style={[styles.dividerText, { color: theme.ink3 }]}>or with email</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.rule }]} />
          </View>

          {/* Demo Hint Banner */}
          <AuthBanner message="Demo account demo@stack.app is filled in. Just press Sign in." />

          {/* Form */}
          <View style={styles.formSection}>
            <AuthField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="demo@stack.app"
              autoCapitalize="none"
              keyboardType="email-address"
              leadingIcon={<EnvelopeSimple size={19} color={theme.ink2} />}
            />

            <AuthField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              isPassword
              leadingIcon={<LockSimple size={19} color={theme.ink2} />}
              trailingRightAction={
                <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
                  <Text style={[styles.forgotLink, { color: theme.accent }]}>Forgot password?</Text>
                </Pressable>
              }
            />

            <Pressable
              onPress={handleSignIn}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: theme.accent,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              <Text style={[styles.primaryButtonText, { color: theme.onAccent }]}>Sign in</Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: theme.ink2 }]}>New here? </Text>
            <Pressable onPress={() => router.push('/(auth)/sign-up')}>
              <Text style={[styles.footerLink, { color: theme.accent }]}>Create an account</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AuthBackdrop>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  titleSection: {
    marginTop: 18,
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14.5,
  },
  socialGroup: {
    gap: 10,
    marginBottom: 16,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 26,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2,
  },
  appleButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    height: 52,
    borderRadius: 26,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '600',
    marginHorizontal: 12,
    textTransform: 'lowercase',
  },
  formSection: {
    gap: 14,
    marginTop: 4,
  },
  forgotLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  primaryButton: {
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
  },
  footerText: {
    fontSize: 13.5,
  },
  footerLink: {
    fontSize: 13.5,
    fontWeight: '700',
  },
});
