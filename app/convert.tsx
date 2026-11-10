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

export default function ConvertScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

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
    // Shift cents
    const nextVal = centsEntered * 10 + parseInt(digit, 10);
    if (nextVal < 10000000) {
      // cap at $100k
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
        isDark ? styles.canvasDark : styles.canvasLight,
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
            color={isDark ? '#F2F7F4' : '#0E1A13'}
            weight="bold"
          />
        </Pressable>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          Convert
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Two Interconnected Cards with Swap Icon */}
        <View style={styles.convertBoxesWrapper}>
          {/* Top Box: From */}
          <View
            style={[
              styles.fromBox,
              isDark ? styles.fromBoxDark : styles.fromBoxLight,
            ]}
          >
            <View style={styles.boxHeaderRow}>
              <Text style={[styles.boxTypeLabel, isDark && styles.boxTypeLabelDark]}>
                From
              </Text>
              <Pressable onPress={cycleFromCard} style={styles.cardPicker}>
                <Text style={[styles.cardPickerText, isDark && styles.cardPickerTextDark]}>
                  {fromCard.nickname} · •••• {fromCard.last4}
                </Text>
                <CaretUpDown size={14} color={isDark ? '#8A9C91' : '#5C6A61'} />
              </Pressable>
            </View>

            <Text style={[styles.bigAmount, isDark && styles.bigAmountDark]}>
              {formattedFromAmount}
            </Text>

            <Text style={[styles.balanceSubtext, isDark && styles.balanceSubtextDark]}>
              {Money.format(fromCard.balanceMinor, fromCard.currency)}
            </Text>
          </View>

          {/* Overlapping Swap Circle */}
          <Pressable
            onPress={handleSwapSides}
            style={[
              styles.swapBadge,
              isDark ? styles.swapBadgeDark : styles.swapBadgeLight,
            ]}
          >
            <ArrowsDownUp
              size={18}
              color={isDark ? '#F2F7F4' : '#0E1A13'}
              weight="bold"
            />
          </Pressable>

          {/* Bottom Box: To */}
          <View
            style={[
              styles.toBox,
              isDark ? styles.toBoxDark : styles.toBoxLight,
            ]}
          >
            <View style={styles.boxHeaderRow}>
              <Text style={[styles.boxTypeLabel, isDark && styles.boxTypeLabelDark]}>
                To
              </Text>
              <Pressable onPress={cycleToCard} style={styles.cardPicker}>
                <Text style={[styles.cardPickerText, isDark && styles.cardPickerTextDark]}>
                  {toCard.nickname} · •••• {toCard.last4}
                </Text>
                <CaretUpDown size={14} color={isDark ? '#8A9C91' : '#5C6A61'} />
              </Pressable>
            </View>

            <Text style={[styles.bigAmount, isDark && styles.bigAmountDark]}>
              {formattedToAmount}
            </Text>

            <Text style={[styles.balanceSubtext, isDark && styles.balanceSubtextDark]}>
              {Money.format(toCard.balanceMinor, toCard.currency)}
            </Text>
          </View>
        </View>

        {/* Info Card Breakdown */}
        <View
          style={[
            styles.infoCard,
            isDark ? styles.infoCardDark : styles.infoCardLight,
          ]}
        >
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>
              Amount
            </Text>
            <Text style={[styles.infoVal, isDark && styles.infoValDark]}>
              {formattedFromAmount}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>
              Fee (0.50%)
            </Text>
            <Text style={[styles.infoVal, isDark && styles.infoValDark]}>
              {feeAmount}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>
              Rate
            </Text>
            <Text style={[styles.infoValBold, isDark && styles.infoValBoldDark]}>
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
                        isDark ? styles.keyCardDark : styles.keyCardLight,
                      ]}
                    >
                      <Backspace
                        size={24}
                        color={isDark ? '#F2F7F4' : '#0E1A13'}
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
                      isDark ? styles.keyCardDark : styles.keyCardLight,
                    ]}
                  >
                    <Text
                      style={[
                        styles.keyText,
                        isDark && styles.keyTextDark,
                      ]}
                    >
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
            isDark ? styles.convertBtnDark : styles.convertBtnLight,
            { opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={styles.convertBtnText}>Convert</Text>
        </Pressable>

        {/* Subtitle Footer */}
        <Text style={[styles.footnote, isDark && styles.footnoteDark]}>
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
  canvasLight: {
    backgroundColor: '#F4F3EF',
  },
  canvasDark: {
    backgroundColor: '#0E1612',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0E1A13',
    letterSpacing: -0.3,
  },
  headerTitleDark: {
    color: '#F2F7F4',
  },
  headerSpacer: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  convertBoxesWrapper: {
    marginVertical: 12,
    position: 'relative',
    gap: 8,
  },
  fromBox: {
    borderRadius: 22,
    padding: 18,
    paddingBottom: 22,
  },
  fromBoxLight: {
    backgroundColor: '#EBE9E2',
  },
  fromBoxDark: {
    backgroundColor: '#1C2620',
  },
  toBox: {
    borderRadius: 22,
    padding: 18,
    paddingBottom: 22,
    borderWidth: 1,
  },
  toBoxLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECEAE4',
  },
  toBoxDark: {
    backgroundColor: '#16201B',
    borderColor: '#26342B',
  },
  boxHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  boxTypeLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#5C6A61',
  },
  boxTypeLabelDark: {
    color: '#8A9C91',
  },
  cardPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardPickerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5C6A61',
  },
  cardPickerTextDark: {
    color: '#8A9C91',
  },
  bigAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0E1A13',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  bigAmountDark: {
    color: '#F2F7F4',
  },
  balanceSubtext: {
    fontSize: 13,
    color: '#5C6A61',
    alignSelf: 'flex-end',
  },
  balanceSubtextDark: {
    color: '#8A9C91',
  },
  swapBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -22,
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 3,
  },
  swapBadgeLight: {
    backgroundColor: '#DAD8CE',
    borderColor: '#F4F3EF',
  },
  swapBadgeDark: {
    backgroundColor: '#2E3D33',
    borderColor: '#0E1612',
  },
  infoCard: {
    borderRadius: 20,
    padding: 18,
    marginVertical: 12,
    borderWidth: 1,
    gap: 10,
  },
  infoCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECEAE4',
  },
  infoCardDark: {
    backgroundColor: '#16201B',
    borderColor: '#26342B',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13.5,
    color: '#5C6A61',
  },
  infoLabelDark: {
    color: '#8A9C91',
  },
  infoVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E1A13',
  },
  infoValDark: {
    color: '#F2F7F4',
  },
  infoValBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0E1A13',
  },
  infoValBoldDark: {
    color: '#F2F7F4',
  },
  keypadWrapper: {
    gap: 10,
    marginVertical: 12,
  },
  keypadRow: {
    flexDirection: 'row',
    gap: 10,
  },
  keyCard: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  keyCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E0D8',
  },
  keyCardDark: {
    backgroundColor: '#1E2822',
    borderColor: '#2B3830',
  },
  keyEmpty: {
    flex: 1,
  },
  keyText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0E1A13',
  },
  keyTextDark: {
    color: '#F2F7F4',
  },
  convertBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  convertBtnLight: {
    backgroundColor: '#204E35',
  },
  convertBtnDark: {
    backgroundColor: '#225B3C',
  },
  convertBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footnote: {
    fontSize: 12.5,
    color: '#5C6A61',
    textAlign: 'center',
    marginTop: 14,
  },
  footnoteDark: {
    color: '#8A9C91',
  },
});
