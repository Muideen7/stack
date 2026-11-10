// app/convert.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowsDownUp, CaretUpDown, Backspace } from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';

import { useWalletStore } from '../store/walletStore';
import { useAuthStore } from '../store/authStore';
import { useTransactionStore } from '../store/transactionStore';
import { Conversion } from '../utils/conversion';
import { Money } from '../utils/money';
import { getTheme } from '../constants/theme';

export default function ConvertScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  const { cards, adjustBalance } = useWalletStore();
  const { rateTable } = useAuthStore();
  const { addTransaction } = useTransactionStore();

  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(cards.length > 1 ? 1 : 0);
  const [centsEntered, setCentsEntered] = useState<number>(0);

  const fromCard = cards[fromIndex] || cards[0];
  const toCard = cards[toIndex] || cards[1] || cards[0];

  const check = Conversion.check(fromCard, toCard, centsEntered, rateTable);
  const quote = check.quote;

  const handleDigit = (digit: string) => {
    Haptics.selectionAsync();
    const nextVal = centsEntered * 10 + parseInt(digit, 10);
    if (nextVal < 10000000) {
      setCentsEntered(nextVal);
    }
  };

  const handleBackspace = () => {
    Haptics.selectionAsync();
    setCentsEntered(Math.floor(centsEntered / 10));
  };

  const handleSwapSides = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFromIndex(toIndex);
    setToIndex(fromIndex);
  };

  const cycleFromCard = () => {
    Haptics.selectionAsync();
    setFromIndex((prev) => (prev + 1) % cards.length);
  };

  const cycleToCard = () => {
    Haptics.selectionAsync();
    setToIndex((prev) => (prev + 1) % cards.length);
  };

  const handleExecuteConvert = () => {
    if (centsEntered <= 0) {
      Alert.alert('Enter Amount', 'Please enter an amount to convert.');
      return;
    }
    if (!check.ok) {
      Alert.alert('Cannot Convert', check.reason);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    adjustBalance(fromCard.id, -quote.amountMinor);
    adjustBalance(toCard.id, quote.convertedMinor);

    addTransaction({
      cardId: fromCard.id,
      kind: 'exchange',
      merchant: `Convert to ${toCard.currency}`,
      category: 'Transfers',
      amountMinor: -quote.amountMinor,
      currency: fromCard.currency,
      note: quote.rateLabel,
    });

    addTransaction({
      cardId: toCard.id,
      kind: 'exchange',
      merchant: `Converted from ${fromCard.currency}`,
      category: 'Transfers',
      amountMinor: quote.convertedMinor,
      currency: toCard.currency,
      note: quote.rateLabel,
    });

    Alert.alert('Conversion Complete', `Successfully converted to ${toCard.currency}.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const fromSymbol = fromCard.currency === 'USD' ? '$' : '€';
  const toSymbol = toCard.currency === 'USD' ? '$' : '€';

  const formattedFromAmount = `${fromSymbol}${(centsEntered / 100).toFixed(2)}`;
  const formattedToAmount = `${toSymbol}${(quote.convertedMinor / 100).toFixed(2)}`;
  const feeAmount = `${fromSymbol}${(quote.feeMinor / 100).toFixed(2)}`;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.ground },
      ]}
      edges={['top', 'bottom']}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft
            size={22}
            color={theme.ink}
            weight="bold"
          />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.ink }]}>
          Convert
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Two Interconnected Boxes with Swap Icon */}
        <View style={styles.convertBoxesWrapper}>
          {/* Top Box: From */}
          <View
            style={[
              styles.boxCard,
              {
                backgroundColor: theme.raised,
                borderColor: theme.rule,
              },
            ]}
          >
            <View style={styles.boxHeaderRow}>
              <Text style={[styles.boxTypeLabel, { color: theme.ink2 }]}>
                From
              </Text>
              <Pressable onPress={cycleFromCard} style={styles.cardPicker}>
                <Text style={[styles.cardPickerText, { color: theme.ink2 }]}>
                  {fromCard.nickname} · •••• {fromCard.last4}
                </Text>
                <CaretUpDown size={14} color={theme.ink2} />
              </Pressable>
            </View>

            <Text style={[styles.bigAmount, { color: theme.ink }]}>
              {formattedFromAmount}
            </Text>

            <Text style={[styles.balanceSubtext, { color: theme.ink3 }]}>
              {Money.format(fromCard.balanceMinor, fromCard.currency)}
            </Text>
          </View>

          {/* Overlapping Swap Circle */}
          <Pressable
            onPress={handleSwapSides}
            style={[
              styles.swapBadge,
              {
                backgroundColor: theme.raisedSubtle,
                borderColor: theme.rule,
              },
            ]}
          >
            <ArrowsDownUp
              size={18}
              color={theme.ink}
              weight="bold"
            />
          </Pressable>

          {/* Bottom Box: To */}
          <View
            style={[
              styles.boxCard,
              {
                backgroundColor: theme.raised,
                borderColor: theme.rule,
              },
            ]}
          >
            <View style={styles.boxHeaderRow}>
              <Text style={[styles.boxTypeLabel, { color: theme.ink2 }]}>
                To
              </Text>
              <Pressable onPress={cycleToCard} style={styles.cardPicker}>
                <Text style={[styles.cardPickerText, { color: theme.ink2 }]}>
                  {toCard.nickname} · •••• {toCard.last4}
                </Text>
                <CaretUpDown size={14} color={theme.ink2} />
              </Pressable>
            </View>

            <Text style={[styles.bigAmount, { color: theme.ink }]}>
              {formattedToAmount}
            </Text>

            <Text style={[styles.balanceSubtext, { color: theme.ink3 }]}>
              {Money.format(toCard.balanceMinor, toCard.currency)}
            </Text>
          </View>
        </View>

        {/* Info Card Breakdown */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.raised,
              borderColor: theme.rule,
            },
          ]}
        >
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.ink2 }]}>
              Amount
            </Text>
            <Text style={[styles.infoVal, { color: theme.ink }]}>
              {formattedFromAmount}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.ink2 }]}>
              Fee (0.50%)
            </Text>
            <Text style={[styles.infoVal, { color: theme.ink }]}>
              {feeAmount}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.ink2 }]}>
              Rate
            </Text>
            <Text style={[styles.infoValBold, { color: theme.ink }]}>
              1 USD = 0.9172 EUR
            </Text>
          </View>
        </View>

        {/* Custom Numeric Keypad */}
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
                      style={[
                        styles.keyCard,
                        {
                          backgroundColor: theme.raised,
                          borderColor: theme.rule,
                        },
                      ]}
                    >
                      <Backspace
                        size={24}
                        color={theme.ink}
                        weight="bold"
                      />
                    </Pressable>
                  );
                }
                return (
                  <Pressable
                    key={cIdx}
                    onPress={() => handleDigit(val)}
                    style={[
                      styles.keyCard,
                      {
                        backgroundColor: theme.raised,
                        borderColor: theme.rule,
                      },
                    ]}
                  >
                    <Text style={[styles.keyText, { color: theme.ink }]}>
                      {val}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        {/* Primary CTA */}
        <Pressable
          onPress={handleExecuteConvert}
          style={({ pressed }) => [
            styles.convertBtn,
            {
              backgroundColor: theme.accent,
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          <Text style={[styles.convertBtnText, { color: theme.onAccent }]}>Convert</Text>
        </Pressable>

        <Text style={[styles.disclaimerText, { color: theme.ink3 }]}>
          Demo rates are indicative, as of 7 November 2026.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  backButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  headerSpacer: {
    width: 38,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  convertBoxesWrapper: {
    position: 'relative',
    marginBottom: 16,
    gap: 8,
  },
  boxCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  boxHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  boxTypeLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardPickerText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  bigAmount: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginVertical: 4,
  },
  balanceSubtext: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  swapBadge: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -20,
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  infoCard: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    marginBottom: 18,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoVal: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  infoValBold: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  keypadWrapper: {
    gap: 10,
    marginBottom: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    gap: 10,
  },
  keyCard: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  keyEmpty: {
    flex: 1,
  },
  keyText: {
    fontSize: 22,
    fontWeight: '800',
  },
  convertBtn: {
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  convertBtnText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  disclaimerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
