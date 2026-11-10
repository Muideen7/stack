// app/(auth)/sign-in.tsx
import * as Haptics from '@/utils/haptics';
import { useRouter } from 'expo-router';
import { AppleLogo, EnvelopeSimple, GoogleLogo, LockSimple } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthBackdrop } from '../../components/auth/AuthBackdrop';
import { AuthBanner } from '../../components/auth/AuthBanner';
import { AuthField } from '../../components/auth/AuthField';
import { StackMark } from '../../components/common/StackMark';
import { useAuthStore } from '../../store/authStore';

export default function SignInScreen() {
  const router = useRouter();
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
          <StackMark size={28} color="#203E2B" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Copy */}
          <View style={styles.titleSection}>
            <Text style={styles.eyebrow}>WELCOME BACK</Text>
            <Text style={styles.title}>Sign in to Stack</Text>
            <Text style={styles.subtitle}>Your wallet, exactly where you left it.</Text>
          </View>

          {/* Social Auth Buttons */}
          <View style={styles.socialGroup}>
            <Pressable
              onPress={handleSocialAuth}
              style={styles.appleButton}
            >
              <AppleLogo size={19} color="#FFFFFF" weight="fill" />
              <Text style={styles.appleButtonText}>Sign in with Apple</Text>
            </Pressable>

            <Pressable
              onPress={handleSocialAuth}
              style={styles.googleButton}
            >
              <GoogleLogo size={19} color="#EA4335" weight="bold" />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or with email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Demo Hint Banner */}
          <AuthBanner message="Demo account demo@stack.app is filled in. Just press Sign in." />

          {/* Input Fields */}
          <View style={styles.formSection}>
            <AuthField
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leadingIcon={<EnvelopeSimple size={19} color="#6B7770" />}
            />

            <AuthField
              label="Password"
              value={password}
              onChangeText={setPassword}
              isPassword
              leadingIcon={<LockSimple size={19} color="#6B7770" />}
              trailingRightAction={
                <Pressable
                  onPress={() => router.push('/(auth)/forgot-password')}
                  hitSlop={8}
                >
                  <Text style={styles.forgotLink}>Forgot password?</Text>
                </Pressable>
              }
            />

            {/* Primary Action Button */}
            <Pressable
              onPress={handleSignIn}
              style={({ pressed }) => [
                styles.primaryButton,
                { opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text style={styles.primaryButtonText}>Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Footer Navigation */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New here? </Text>
          <Pressable onPress={() => router.push('/(auth)/sign-up')} hitSlop={8}>
            <Text style={styles.footerLink}>Create an account</Text>
          </Pressable>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 24,
  },
  titleSection: {
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: '#24563B',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0E1A13',
    lineHeight: 38,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14.5,
    color: '#4A564E',
    lineHeight: 20,
  },
  socialGroup: {
    gap: 12,
    marginBottom: 16,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    height: 52,
    borderRadius: 26,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8D7D1',
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
    color: '#0E1A13',
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
    backgroundColor: '#DCDAD3',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#657169',
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
    color: '#204E35',
  },
  primaryButton: {
    backgroundColor: '#204E35',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    shadowColor: '#1B3E2B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  footerText: {
    fontSize: 13.5,
    color: '#556159',
  },
  footerLink: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#204E35',
  },
});
