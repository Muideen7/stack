// app/(auth)/otp.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Backspace, Info } from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';

import { AuthBackdrop } from '../../components/auth/AuthBackdrop';
import { StackMark } from '../../components/common/StackMark';
import { getTheme } from '../../constants/theme';

export default function OtpScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  const [code, setCode] = useState('');

  const handleDigit = (digit: string) => {
    if (code.length < 6) {
      Haptics.selectionAsync();
      const next = code + digit;
      setCode(next);
      if (next.length === 6) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => {
          router.push('/(auth)/pin');
        }, 300);
      }
    }
  };

  const handleBackspace = () => {
    if (code.length > 0) {
      Haptics.selectionAsync();
      setCode(code.slice(0, -1));
    }
  };

  const handleFillDemoCode = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCode('284917');
    setTimeout(() => {
      router.push('/(auth)/pin');
    }, 400);
  };

  const handleVerify = () => {
    if (code.length === 6) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push('/(auth)/pin');
    }
  };

  return (
    <AuthBackdrop>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
            <ArrowLeft size={22} color={theme.ink} />
          </Pressable>
          <StackMark size={28} color={theme.accent} />
        </View>

        {/* Content Area */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={[styles.eyebrow, { color: theme.accent }]}>VERIFY</Text>
            <Text style={[styles.title, { color: theme.ink }]}>Enter your six-digit code</Text>
            <Text style={[styles.subtitle, { color: theme.ink2 }]}>
              Sent to demo@stack.app. It expires in ten minutes.
            </Text>
          </View>

          {/* 6 Digit Input Boxes */}
          <View style={styles.codeRow}>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const val = code[i];
              const isCurrent = code.length === i;
              return (
                <View
                  key={i}
                  style={[
                    styles.codeBox,
                    {
                      backgroundColor: val ? theme.raised : theme.raisedSubtle,
                      borderColor: isCurrent ? theme.accent : val ? theme.rule : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.codeDigit,
                      {
                        color: isCurrent ? theme.accent : val ? theme.ink : theme.ink3,
                      },
                    ]}
                  >
                    {val || '-'}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Demo Code Auto-fill Pill */}
          <Pressable
            onPress={handleFillDemoCode}
            style={({ pressed }) => [
              styles.demoPill,
              {
                backgroundColor: theme.accentSoft,
                borderColor: theme.rule,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Info size={15} color={theme.accent} weight="bold" />
            <Text style={[styles.demoPillText, { color: theme.ink }]}>Demo code: 284917</Text>
          </Pressable>

          <Text style={[styles.resendText, { color: theme.ink2 }]}>Resend in 27s</Text>

          {/* Verify Button */}
          <Pressable
            onPress={handleVerify}
            disabled={code.length < 6}
            style={[
              styles.verifyButton,
              {
                backgroundColor: code.length === 6 ? theme.accent : theme.raisedSubtle,
                borderColor: theme.rule,
              },
            ]}
          >
            <Text
              style={[
                styles.verifyButtonText,
                {
                  color: code.length === 6 ? theme.onAccent : theme.ink3,
                },
              ]}
            >
              Verify
            </Text>
          </Pressable>
        </View>

        {/* Custom numeric keypad */}
        <View style={styles.keypadContainer}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['', '0', 'delete'],
          ].map((row, rIdx) => (
            <View key={rIdx} style={styles.keypadRow}>
              {row.map((k, cIdx) => {
                if (k === '') {
                  return <View key={cIdx} style={styles.keyEmpty} />;
                }
                if (k === 'delete') {
                  return (
                    <Pressable
                      key={cIdx}
                      onPress={handleBackspace}
                      style={({ pressed }) => [
                        styles.keyButton,
                        {
                          backgroundColor: theme.raised,
                          borderColor: theme.rule,
                          opacity: pressed ? 0.6 : 1,
                        },
                      ]}
                    >
                      <Backspace size={24} color={theme.ink} weight="bold" />
                    </Pressable>
                  );
                }
                return (
                  <Pressable
                    key={cIdx}
                    onPress={() => handleDigit(k)}
                    style={({ pressed }) => [
                      styles.keyButton,
                      {
                        backgroundColor: theme.raised,
                        borderColor: theme.rule,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.keyDigit, { color: theme.ink }]}>{k}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </SafeAreaView>
    </AuthBackdrop>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  backButton: {
    padding: 4,
  },
  content: {
    paddingTop: 12,
    alignItems: 'center',
  },
  titleSection: {
    alignSelf: 'stretch',
    marginBottom: 26,
    paddingHorizontal: 4,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  title: {
    fontSize: 31,
    fontWeight: '800',
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14.5,
    lineHeight: 20,
  },
  codeRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 14,
  },
  codeBox: {
    width: 48,
    height: 58,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  codeDigit: {
    fontSize: 22,
    fontWeight: '700',
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 18,
    marginBottom: 10,
  },
  demoPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  resendText: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 20,
  },
  verifyButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  keypadContainer: {
    paddingBottom: 10,
    gap: 8,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  keyButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  keyEmpty: {
    flex: 1,
    height: 50,
  },
  keyDigit: {
    fontSize: 22,
    fontWeight: '700',
  },
});
