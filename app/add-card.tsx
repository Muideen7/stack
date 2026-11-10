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
import { getTheme } from '../constants/theme';

const SWATCH_SKINS: { id: CardSkin; color: string }[] = [
  { id: 'forest', color: '#0D1612' },
  { id: 'moss', color: '#044331' },
  { id: 'sage', color: '#111D2D' },
  { id: 'obsidian', color: '#0C0E12' },
  { id: 'bone', color: '#ECEFF2' },
];

export default function AddCardScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

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
    holder: holder.trim() ? holder.toUpperCase() : 'FRONTENDGEEK',
    expiryMonth: parseInt(expiryRaw.slice(0, 2), 10) || 12,
    expiryYear: parseInt(expiryRaw.slice(2, 4), 10) ? 2000 + parseInt(expiryRaw.slice(2, 4), 10) : 2029,
    nickname: nickname.trim() || 'Credit',
    skin,
    balanceMinor: 250000,
    currency: 'USD',
    frozen: false,
    spendLimitMinor: null,
  };

  const isFormValid =
    digitsOnly.length >= 15 &&
    holder.trim().length > 0 &&
    expiryRaw.length === 4 &&
    cvcRaw.length >= 3;

  const handleSubmit = () => {
    if (!isFormValid) {
      Alert.alert('Incomplete Details', 'Please fill in all card details.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    addCard({
      last4,
      brand,
      funding: 'credit',
      holder: holder.trim().toUpperCase(),
      expiryMonth: parseInt(expiryRaw.slice(0, 2), 10),
      expiryYear: 2000 + parseInt(expiryRaw.slice(2, 4), 10),
      nickname: nickname.trim() || (brand === 'visa' ? 'Visa' : 'Mastercard'),
      skin,
      balanceMinor: 100000, // seed initial balance $1,000.00
      currency: 'USD',
      frozen: false,
      spendLimitMinor: null,
    });

    router.back();
  };

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
          Add a card
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Dynamic Card Preview */}
        <View style={styles.previewWrapper}>
          <CardFace card={previewCard} />
        </View>

        {/* Color / Skin Swatches */}
        <View style={styles.swatchSection}>
          <Text style={[styles.sectionLabel, { color: theme.ink2 }]}>Card skin</Text>
          <View style={styles.swatchesRow}>
            {SWATCH_SKINS.map((s) => {
              const isSelected = skin === s.id;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSkin(s.id);
                  }}
                  style={[
                    styles.swatchCircle,
                    { backgroundColor: s.color },
                    s.id === 'bone' && styles.boneBorder,
                  ]}
                >
                  {isSelected && (
                    <Check
                      size={14}
                      color={s.id === 'bone' ? '#0B0E14' : '#FFFFFF'}
                      weight="bold"
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Inputs */}
        <View style={styles.formSection}>
          <TextInput
            placeholder="Card number"
            placeholderTextColor={theme.ink3}
            value={formattedNumber}
            onChangeText={(text) => setNumberRaw(text.replace(/\D/g, '').slice(0, 16))}
            keyboardType="number-pad"
            style={[
              styles.input,
              {
                backgroundColor: theme.raised,
                borderColor: theme.rule,
                color: theme.ink,
              },
            ]}
          />

          <TextInput
            placeholder="Cardholder name"
            placeholderTextColor={theme.ink3}
            value={holder}
            onChangeText={setHolder}
            autoCapitalize="characters"
            style={[
              styles.input,
              {
                backgroundColor: theme.raised,
                borderColor: theme.rule,
                color: theme.ink,
              },
            ]}
          />

          <View style={styles.twoInputsRow}>
            <TextInput
              placeholder="MM/YY"
              placeholderTextColor={theme.ink3}
              value={expiryRaw}
              onChangeText={(text) => setExpiryRaw(text.replace(/\D/g, '').slice(0, 4))}
              keyboardType="number-pad"
              style={[
                styles.input,
                styles.halfInput,
                {
                  backgroundColor: theme.raised,
                  borderColor: theme.rule,
                  color: theme.ink,
                },
              ]}
            />
            <TextInput
              placeholder="CVV"
              placeholderTextColor={theme.ink3}
              value={cvcRaw}
              onChangeText={(text) => setCvcRaw(text.replace(/\D/g, '').slice(0, 4))}
              keyboardType="number-pad"
              secureTextEntry
              style={[
                styles.input,
                styles.halfInput,
                {
                  backgroundColor: theme.raised,
                  borderColor: theme.rule,
                  color: theme.ink,
                },
              ]}
            />
          </View>

          <TextInput
            placeholder="Nickname (e.g. Everyday, Travel)"
            placeholderTextColor={theme.ink3}
            value={nickname}
            onChangeText={setNickname}
            style={[
              styles.input,
              {
                backgroundColor: theme.raised,
                borderColor: theme.rule,
                color: theme.ink,
              },
            ]}
          />

          <Text style={[styles.helperText, { color: theme.ink2 }]}>
            Brand is auto-detected. We never store full card credentials unencrypted.
          </Text>

          <View style={styles.noticeRow}>
            <Lock size={14} color={theme.ink2} />
            <Text style={[styles.noticeText, { color: theme.ink2 }]}>
              Protected with AES-256 hardware secure enclave.
            </Text>
          </View>

          {/* Primary CTA */}
          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              {
                backgroundColor: isFormValid ? theme.accent : theme.raisedSubtle,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.submitButtonText,
                { color: isFormValid ? theme.onAccent : theme.ink3 },
              ]}
            >
              Add Card
            </Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 38,
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
    fontWeight: '600',
    marginBottom: 10,
  },
  swatchesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  swatchCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
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
  twoInputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  helperText: {
    fontSize: 12.5,
    marginTop: 6,
    paddingHorizontal: 4,
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
  },
  submitButton: {
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
