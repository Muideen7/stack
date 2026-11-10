// app/(auth)/forgot-password.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, EnvelopeSimple } from 'phosphor-react-native';
import * as Haptics from '@/utils/haptics';

import { AuthBackdrop } from '../../components/auth/AuthBackdrop';
import { StackMark } from '../../components/common/StackMark';
import { AuthField } from '../../components/auth/AuthField';
import { AuthBanner } from '../../components/auth/AuthBanner';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@stack.app');

  const handleSendCode = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/(auth)/otp');
  };

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
            <Text style={styles.eyebrow}>RESET</Text>
            <Text style={styles.title}>Forgot your password?</Text>
            <Text style={styles.subtitle}>
              Tell us the address on the account and we will send a six-digit code.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <AuthField
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leadingIcon={<EnvelopeSimple size={19} color="#6B7770" />}
            />

            {/* Confirmation Info Banner */}
            <AuthBanner message="If an account exists for that address, a code is on its way." />

            {/* Primary Action Button */}
            <Pressable
              onPress={handleSendCode}
              style={({ pressed }) => [
                styles.primaryButton,
                { opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text style={styles.primaryButtonText}>Send code</Text>
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
    marginBottom: 24,
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14.5,
    color: '#4A564E',
    lineHeight: 21,
  },
  formSection: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#204E35',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
});
