// app/(auth)/sign-up.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, AppleLogo, GoogleLogo, User, EnvelopeSimple, LockSimple } from 'phosphor-react-native';
import * as Haptics from '@/utils/haptics';

import { AuthBackdrop } from '../../components/auth/AuthBackdrop';
import { StackMark } from '../../components/common/StackMark';
import { AuthField } from '../../components/auth/AuthField';

export default function SignUpScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/(auth)/otp');
  };

  const handleSocialSignUp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/otp');
  };

  // Password strength (0 to 3)
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;

  return (
    <AuthBackdrop>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Top Header: Back Arrow on Left & Logo on Right */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
            <ArrowLeft size={22} color="#1A241E" />
          </Pressable>
          <StackMark size={28} color="#203E2B" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Copy */}
          <View style={styles.titleSection}>
            <Text style={styles.eyebrow}>GET STARTED</Text>
            <Text style={styles.title}>Create your Stack account</Text>
            <Text style={styles.subtitle}>
              It takes about a minute. No card needed to look around.
            </Text>
          </View>

          {/* Social Auth Buttons */}
          <View style={styles.socialGroup}>
            <Pressable
              onPress={handleSocialSignUp}
              style={styles.appleButton}
            >
              <AppleLogo size={19} color="#FFFFFF" weight="fill" />
              <Text style={styles.appleButtonText}>Sign up with Apple</Text>
            </Pressable>

            <Pressable
              onPress={handleSocialSignUp}
              style={styles.googleButton}
            >
              <GoogleLogo size={19} color="#EA4335" weight="bold" />
              <Text style={styles.googleButtonText}>Sign up with Google</Text>
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or with email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Input Fields */}
          <View style={styles.formSection}>
            <AuthField
              label="Full name"
              value={name}
              onChangeText={setName}
              placeholder="Alex Stack"
              autoCapitalize="words"
              leadingIcon={<User size={19} color="#6B7770" />}
            />

            <AuthField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leadingIcon={<EnvelopeSimple size={19} color="#6B7770" />}
            />

            <AuthField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              isPassword
              leadingIcon={<LockSimple size={19} color="#6B7770" />}
            />

            {/* Password strength progress bar */}
            <View style={styles.strengthRow}>
              {[1, 2, 3].map((step) => (
                <View
                  key={step}
                  style={[
                    styles.strengthBar,
                    {
                      backgroundColor:
                        step <= strength ? '#204E35' : '#D6D5CE',
                    },
                  ]}
                />
              ))}
            </View>

            {/* Primary Action Button */}
            <Pressable
              onPress={handleSignUp}
              style={({ pressed }) => [
                styles.primaryButton,
                { opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text style={styles.primaryButtonText}>Create account</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Footer Navigation */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => router.push('/(auth)/sign-in')} hitSlop={8}>
            <Text style={styles.footerLink}>Sign in</Text>
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
  backButton: {
    padding: 4,
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
    gap: 12,
    marginTop: 4,
  },
  strengthRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
    marginBottom: 6,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
  },
  primaryButton: {
    backgroundColor: '#204E35',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
