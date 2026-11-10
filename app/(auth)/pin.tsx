// app/(auth)/pin.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Backspace } from 'phosphor-react-native';
import * as Haptics from '@/utils/haptics';

import { useAuthStore } from '../../store/authStore';
import { AuthBackdrop } from '../../components/auth/AuthBackdrop';
import { StackMark } from '../../components/common/StackMark';

export default function PinScreen() {
  const router = useRouter();
  const { setPin, setAuthenticated } = useAuthStore();
  const [entered, setEntered] = useState('');

  const handleDigit = (digit: string) => {
    if (entered.length < 4) {
      Haptics.selectionAsync();
      const next = entered + digit;
      setEntered(next);

      if (next.length === 4) {
        setPin(next);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => {
          router.push('/(auth)/demo-settings');
        }, 300);
      }
    }
  };

  const handleBackspace = () => {
    if (entered.length > 0) {
      Haptics.selectionAsync();
      setEntered(entered.slice(0, -1));
    }
  };

  return (
    <AuthBackdrop>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View />
          <StackMark size={28} color="#203E2B" />
        </View>

        {/* Center Title & 4-circle PIN indicator */}
        <View style={styles.centerSection}>
          <Text style={styles.title}>Set a PIN</Text>
          <Text style={styles.subtitle}>
            You will use this to open Stack. 4 digits.
          </Text>

          {/* 4 Indicators */}
          <View style={styles.indicatorRow}>
            {[0, 1, 2, 3].map((i) => {
              const filled = i < entered.length;
              return (
                <View
                  key={i}
                  style={[
                    styles.circleIndicator,
                    filled && styles.circleIndicatorFilled,
                  ]}
                />
              );
            })}
          </View>
        </View>

        {/* Clean Numeric Keypad */}
        <View style={styles.keypadWrapper}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['', '0', 'backspace'],
          ].map((row, rIdx) => (
            <View key={rIdx} style={styles.keypadRow}>
              {row.map((val, cIdx) => {
                if (val === '') {
                  return <View key={cIdx} style={styles.keyEmpty} />;
                }
                if (val === 'backspace') {
                  return (
                    <Pressable
                      key={cIdx}
                      onPress={handleBackspace}
                      style={({ pressed }) => [
                        styles.keyButtonEmpty,
                        { opacity: pressed ? 0.6 : 1 },
                      ]}
                    >
                      <Backspace size={26} color="#3A463E" />
                    </Pressable>
                  );
                }
                return (
                  <Pressable
                    key={cIdx}
                    onPress={() => handleDigit(val)}
                    style={({ pressed }) => [
                      styles.keyCard,
                      { opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    <Text style={styles.keyDigitText}>{val}</Text>
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
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  centerSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0E1A13',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14.5,
    color: '#4B574F',
    textAlign: 'center',
    marginBottom: 36,
  },
  indicatorRow: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  circleIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.8,
    borderColor: '#738077',
    backgroundColor: 'transparent',
  },
  circleIndicatorFilled: {
    borderColor: '#204E35',
    backgroundColor: '#204E35',
  },
  keypadWrapper: {
    paddingBottom: 20,
    gap: 12,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  keyCard: {
    flex: 1,
    height: 62,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E0D8',
  },
  keyButtonEmpty: {
    flex: 1,
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyEmpty: {
    flex: 1,
    height: 62,
  },
  keyDigitText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0E1A13',
  },
});
