// app/add-card.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Lock } from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';

import { useWalletStore } from '../store/walletStore';
import { CardFace } from '../components/cards/CardFace';
import { CardValidation } from '../utils/cardValidation';
import { CardSkin, PaymentCard } from '../types/models';

const SWATCH_SKINS: { id: CardSkin; color: string }[] = [
  { id: 'forest', color: '#162F21' },
  { id: 'moss', color: '#23583C' },
  { id: 'sage', color: '#557261' },
  { id: 'obsidian', color: '#1B221E' },
  { id: 'bone', color: '#E2E0D5' },
];

export default function AddCardScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { addCard } = useWalletStore();

  const [numberRaw, setNumberRaw] = useState('');
  const [holder, setHolder] = useState('');
  const [expiryRaw, setExpiryRaw] = useState('');
  const [cvcRaw, setCvcRaw] = useState('');
  const [nickname, setNickname] = useState('');
  const [skin, setSkin] = useState<CardSkin>('forest');

  const brand = CardValidation.detectBrand(numberRaw);
  const formattedNumber = CardValidation.format(numberRaw, brand);
  const digitsOnly = CardValidation.digitsOnly(numberRaw);
  const last4 = digitsOnly.slice(-4) || '••••';

  const previewCard: PaymentCard = {
    id: 'preview',
    last4: last4.length === 4 && digitsOnly.length >= 4 ? last4 : '••••',
    brand,
    funding: 'credit',
    holder: holder.trim() ? holder.toUpperCase() : 'YOUR NAME',
    expiryMonth: parseInt(expiryRaw.slice(0, 2), 10) || 12,
    expiryYear: parseInt(expiryRaw.slice(2, 4), 10) ? 2000 + parseInt(expiryRaw.slice(2, 4), 10) : 2029,
    nickname: nickname.trim() || 'Credit',
    skin,
    balanceMinor: 250000,
    currency: 'USD',
    frozen: false,
  };

  const isFormValid =
    digitsOnly.length >= 15 &&
    holder.trim().length >= 2 &&
    expiryRaw.length >= 4 &&
    cvcRaw.length >= 3;

  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 4);
    setExpiryRaw(cleaned);
  };

  const formattedExpiryDisplay = () => {
    if (expiryRaw.length <= 2) return expiryRaw;
    return `${expiryRaw.slice(0, 2)}/${expiryRaw.slice(2, 4)}`;
  };

  const handleCreate = () => {
    const numErr = CardValidation.validateNumber(numberRaw);
    if (numErr) {
      Alert.alert('Card Number Error', numErr);
      return;
    }
    const expErr = CardValidation.validateExpiry(expiryRaw);
    if (expErr) {
      Alert.alert('Expiry Error', expErr);
      return;
    }
    const cvcErr = CardValidation.validateCvc(cvcRaw, brand);
    if (cvcErr) {
      Alert.alert('Security Code Error', cvcErr);
      return;
    }
    if (!holder.trim()) {
      Alert.alert('Cardholder Required', 'Please enter the name on the card.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addCard({
      last4: digitsOnly.slice(-4),
      brand,
      funding: 'credit',
      holder: holder.trim().toUpperCase(),
      expiryMonth: previewCard.expiryMonth,
      expiryYear: previewCard.expiryYear,
      nickname: nickname.trim() || `${brand.toUpperCase()} Credit`,
      skin,
      balanceMinor: 250000,
      currency: 'USD',
      frozen: false,
    });

    router.back();
  };

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
          Add card
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Live Card Preview */}
        <View style={styles.previewWrapper}>
          <CardFace card={previewCard} showBalance={false} />
        </View>

        {/* Card colour section */}
        <View style={styles.swatchSection}>
          <Text style={[styles.sectionLabel, isDark && styles.sectionLabelDark]}>
            Card colour
          </Text>
          <View style={styles.swatchesRow}>
            {SWATCH_SKINS.map((item) => {
              const isSelected = skin === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSkin(item.id);
                  }}
                  style={[
                    styles.swatchCircle,
                    { backgroundColor: item.color },
                    item.id === 'bone' && styles.boneBorder,
                  ]}
                >
                  {isSelected && (
                    <Check
                      size={14}
                      color={item.id === 'bone' ? '#0E1A13' : '#FFFFFF'}
                      weight="bold"
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Form Inputs */}
        <View style={styles.formSection}>
          {/* Card Number */}
          <TextInput
            placeholder="Card number"
            placeholderTextColor={isDark ? '#8A9C91' : '#8A968E'}
            value={formattedNumber}
            onChangeText={setNumberRaw}
            keyboardType="number-pad"
            style={[
              styles.input,
              isDark ? styles.inputDark : styles.inputLight,
            ]}
          />

          {/* Expiry and Security Code Row */}
          <View style={styles.twoInputsRow}>
            <TextInput
              placeholder="Expiry"
              placeholderTextColor={isDark ? '#8A9C91' : '#8A968E'}
              value={formattedExpiryDisplay()}
              onChangeText={handleExpiryChange}
              keyboardType="number-pad"
              maxLength={5}
              style={[
                styles.input,
                styles.halfInput,
                isDark ? styles.inputDark : styles.inputLight,
              ]}
            />
            <TextInput
              placeholder="Security code"
              placeholderTextColor={isDark ? '#8A9C91' : '#8A968E'}
              value={cvcRaw}
              onChangeText={setCvcRaw}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              style={[
                styles.input,
                styles.halfInput,
                isDark ? styles.inputDark : styles.inputLight,
              ]}
            />
          </View>

          {/* Name on Card */}
          <TextInput
            placeholder="Name on card"
            placeholderTextColor={isDark ? '#8A9C91' : '#8A968E'}
            value={holder}
            onChangeText={setHolder}
            autoCapitalize="words"
            style={[
              styles.input,
              isDark ? styles.inputDark : styles.inputLight,
            ]}
          />

          {/* Card Name (Nickname) */}
          <View>
            <TextInput
              placeholder="Card name"
              placeholderTextColor={isDark ? '#8A9C91' : '#8A968E'}
              value={nickname}
              onChangeText={setNickname}
              style={[
                styles.input,
                isDark ? styles.inputDark : styles.inputLight,
              ]}
            />
            <Text style={[styles.helperText, isDark && styles.helperTextDark]}>
              Optional. Shown on the card and in your wallet.
            </Text>
          </View>

          {/* Encryption Guarantee Notice */}
          <View style={styles.noticeRow}>
            <Lock size={15} color={isDark ? '#8A9C91' : '#5C6A61'} weight="regular" />
            <Text style={[styles.noticeText, isDark && styles.noticeTextDark]}>
              Your details are encrypted and never leave this device.
            </Text>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleCreate}
            style={({ pressed }) => [
              styles.submitButton,
              isFormValid
                ? (isDark ? styles.submitValidDark : styles.submitValidLight)
                : (isDark ? styles.submitMutedDark : styles.submitMutedLight),
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.submitButtonText}>Add card</Text>
          </Pressable>
        </View>
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  previewWrapper: {
    marginVertical: 16,
  },
  swatchSection: {
    marginVertical: 10,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#5C6A61',
    fontWeight: '500',
    marginBottom: 10,
  },
  sectionLabelDark: {
    color: '#8A9C91',
  },
  swatchesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  swatchCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boneBorder: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  formSection: {
    marginTop: 16,
    gap: 14,
  },
  input: {
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    borderWidth: 1,
  },
  inputLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E0D8',
    color: '#0E1A13',
  },
  inputDark: {
    backgroundColor: '#16201B',
    borderColor: '#26342B',
    color: '#F2F7F4',
  },
  twoInputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  helperText: {
    fontSize: 12.5,
    color: '#5C6A61',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  helperTextDark: {
    color: '#8A9C91',
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  noticeText: {
    fontSize: 12.5,
    color: '#5C6A61',
  },
  noticeTextDark: {
    color: '#8A9C91',
  },
  submitButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  submitValidLight: {
    backgroundColor: '#204E35',
  },
  submitValidDark: {
    backgroundColor: '#225B3C',
  },
  submitMutedLight: {
    backgroundColor: '#9FB2A6',
  },
  submitMutedDark: {
    backgroundColor: '#354A3E',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
  },
});
