// app/(auth)/forgot-password.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, EnvelopeSimple } from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';

import { AuthBackdrop } from '../../components/auth/AuthBackdrop';
import { StackMark } from '../../components/common/StackMark';
import { AuthField } from '../../components/auth/AuthField';
import { AuthBanner } from '../../components/auth/AuthBanner';
import { getTheme } from '../../constants/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

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
            <ArrowLeft size={22} color={theme.ink} />
          </Pressable>
          <StackMark size={28} color={theme.accent} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Copy */}
          <View style={styles.titleSection}>
            <Text style={[styles.eyebrow, { color: theme.accent }]}>RESET</Text>
            <Text style={[styles.title, { color: theme.ink }]}>Forgot your password?</Text>
            <Text style={[styles.subtitle, { color: theme.ink2 }]}>
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
              leadingIcon={<EnvelopeSimple size={19} color={theme.ink2} />}
            />

            {/* Confirmation Info Banner */}
            <AuthBanner message="If an account exists for that address, a code is on its way." />

            {/* Primary Action Button */}
            <Pressable
              onPress={handleSendCode}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: theme.accent,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              <Text style={[styles.primaryButtonText, { color: theme.onAccent }]}>Send code</Text>
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
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14.5,
    lineHeight: 21,
  },
  formSection: {
    gap: 12,
  },
  primaryButton: {
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
});
