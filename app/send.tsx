// app/send.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  X,
  UserPlus,
  DotsThree,
  Info,
  CheckCircle,
  Backspace,
} from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';

import { useWalletStore } from '../store/walletStore';
import { useRecipientStore } from '../store/recipientStore';
import { useTransactionStore } from '../store/transactionStore';
import { Recipient } from '../types/models';
import { Money } from '../utils/money';
import { getTheme } from '../constants/theme';

export default function SendScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  const { cards, adjustBalance } = useWalletStore();
  const { recipients, touchRecipient, addRecipient } = useRecipientStore();
  const { addTransaction } = useTransactionStore();

  const [step, setStep] = useState<'recipient' | 'amount' | 'pin' | 'success'>('recipient');
  const [search, setSearch] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [amountInput, setAmountInput] = useState('75');
  const [pin, setPin] = useState('');

  const activeCard = cards.find((c) => !c.frozen) || cards[0];
  const amountMinor = Math.round(parseFloat(amountInput || '0') * 100);

  const filteredRecipients = recipients.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.handle.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q)
    );
  });

  const handleSelectRecipient = (r: Recipient) => {
    Haptics.selectionAsync();
    setSelectedRecipient(r);
  };

  const handleContinueToAmount = () => {
    if (!selectedRecipient) {
      if (filteredRecipients.length > 0) {
        setSelectedRecipient(filteredRecipients[0]);
      } else {
        Alert.alert('Select Recipient', 'Please choose a contact to send funds to.');
        return;
      }
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep('amount');
  };

  const handleAmountKey = (digit: string) => {
    Haptics.selectionAsync();
    if (amountInput === '0') {
      setAmountInput(digit);
    } else {
      setAmountInput(amountInput + digit);
    }
  };

  const handleAmountBackspace = () => {
    Haptics.selectionAsync();
    if (amountInput.length <= 1) {
      setAmountInput('0');
    } else {
      setAmountInput(amountInput.slice(0, -1));
    }
  };

  const handleConfirmAmount = () => {
    if (amountMinor <= 0) {
      Alert.alert('Invalid Amount', 'Please enter an amount greater than zero.');
      return;
    }
    if (activeCard && activeCard.balanceMinor < amountMinor) {
      Alert.alert(
        'Insufficient Balance',
        `You do not have enough funds on ${activeCard.nickname}. Available: ${Money.format(activeCard.balanceMinor, activeCard.currency)}`
      );
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep('pin');
  };

  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) {
      Haptics.selectionAsync();
      const next = pin + digit;
      setPin(next);

      if (next.length === 4) {
        setTimeout(() => {
          if (activeCard && selectedRecipient) {
            adjustBalance(activeCard.id, -amountMinor);
            addTransaction({
              cardId: activeCard.id,
              kind: 'transfer',
              merchant: `To ${selectedRecipient.name}`,
              category: 'Transfers',
              amountMinor: -amountMinor,
              currency: activeCard.currency,
              note: `Sent to ${selectedRecipient.handle}`,
            });
            touchRecipient(selectedRecipient.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setStep('success');
          }
        }, 300);
      }
    }
  };

  const handlePinBackspace = () => {
    if (pin.length > 0) {
      Haptics.selectionAsync();
      setPin(pin.slice(0, -1));
    }
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
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <X size={22} color={theme.ink} weight="bold" />
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.ink }]}>
            {step === 'recipient' && 'Send to'}
            {step === 'amount' && 'Amount'}
            {step === 'pin' && 'Enter PIN'}
            {step === 'success' && 'Sent'}
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* 4-step progress indicator bar */}
        <View style={styles.stepperRow}>
          {[0, 1, 2, 3].map((idx) => {
            const stepIndex =
              step === 'recipient' ? 0 : step === 'amount' ? 1 : step === 'pin' ? 2 : 3;
            const isCompletedOrActive = idx <= stepIndex;
            return (
              <View
                key={idx}
                style={[
                  styles.stepperBar,
                  {
                    backgroundColor: isCompletedOrActive ? theme.accent : theme.rule,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* Step 1: Select Recipient */}
      {step === 'recipient' && (
        <View style={styles.contentContainer}>
          {/* Search Bar */}
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: theme.raised,
                borderColor: theme.rule,
              },
            ]}
          >
            <Text style={[styles.atSymbol, { color: theme.ink2 }]}>@</Text>
            <TextInput
              placeholder="Handle, email or name"
              placeholderTextColor={theme.ink3}
              value={search}
              onChangeText={setSearch}
              style={[
                styles.searchInput,
                { color: theme.ink },
              ]}
            />
          </View>

          {/* Section: Recent */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            <Text style={[styles.sectionLabel, { color: theme.ink2 }]}>
              Recent
            </Text>

            <View style={styles.recipientsList}>
              {filteredRecipients.map((r) => {
                const isSelected = selectedRecipient?.id === r.id;
                const initials = r.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <Pressable
                    key={r.id}
                    onPress={() => handleSelectRecipient(r)}
                    style={[
                      styles.recipientRow,
                      {
                        backgroundColor: isSelected ? theme.accentSoft : theme.raised,
                        borderColor: isSelected ? theme.accent : theme.rule,
                      },
                    ]}
                  >
                    {/* Circle Avatar */}
                    <View
                      style={[
                        styles.avatarCircle,
                        {
                          backgroundColor: isSelected ? theme.accentSoft : theme.raisedSubtle,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.avatarText,
                          { color: isSelected ? theme.accent : theme.ink },
                        ]}
                      >
                        {initials}
                      </Text>
                    </View>

                    {/* Metadata */}
                    <View style={styles.metaCol}>
                      <Text style={[styles.nameText, { color: theme.ink }]}>
                        {r.name}
                      </Text>
                      <Text style={[styles.handleText, { color: theme.ink2 }]}>
                        {r.handle}
                      </Text>
                    </View>

                    {/* Right action icons */}
                    <View style={styles.rightActions}>
                      {!r.verified && (
                        <Info size={18} color="#D97706" weight="bold" />
                      )}
                      <DotsThree
                        size={22}
                        color={theme.ink2}
                        weight="bold"
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Add a recipient card button */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.prompt(
                  'Add Recipient',
                  'Enter full name and handle (@username)',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Add',
                      onPress: (val) => {
                        if (val && val.trim()) {
                          addRecipient({
                            name: val.trim(),
                            handle: `@${val.toLowerCase().replace(/\s+/g, '')}`,
                            email: `${val.toLowerCase().replace(/\s+/g, '')}@example.com`,
                            verified: true,
                          });
                        }
                      },
                    },
                  ]
                );
              }}
              style={[
                styles.addRecipientCard,
                {
                  backgroundColor: theme.raised,
                  borderColor: theme.rule,
                },
              ]}
            >
              <UserPlus
                size={20}
                color={theme.ink}
                weight="bold"
              />
              <Text style={[styles.addRecipientText, { color: theme.ink }]}>
                Add a recipient
              </Text>
            </Pressable>
          </ScrollView>

          {/* Bottom Primary Button */}
          <Pressable
            onPress={handleContinueToAmount}
            style={({ pressed }) => [
              styles.continueButton,
              {
                backgroundColor: theme.accent,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
          >
            <Text style={[styles.continueText, { color: theme.onAccent }]}>Continue</Text>
          </Pressable>
        </View>
      )}

      {/* Step 2: Amount Entry */}
      {step === 'amount' && (
        <View style={styles.contentContainer}>
          <View style={styles.amountHeaderSection}>
            <Text style={[styles.sendingToText, { color: theme.ink2 }]}>
              Sending to <Text style={[styles.boldName, { color: theme.ink }]}>{selectedRecipient?.name}</Text>
            </Text>
            <Text style={[styles.amountDisplay, { color: theme.ink }]}>
              ${amountInput}.00
            </Text>
            <Text style={[styles.cardDebitText, { color: theme.ink2 }]}>
              From {activeCard?.nickname} · •••• {activeCard?.last4}
            </Text>
          </View>

          {/* Numeric Keypad */}
          <View style={styles.keypadWrapper}>
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
              ['', '0', 'backspace'],
            ].map((row, rIdx) => (
              <View key={rIdx} style={styles.keypadRow}>
                {row.map((val, cIdx) => {
                  if (val === '') return <View key={cIdx} style={styles.keyEmpty} />;
                  if (val === 'backspace') {
                    return (
                      <Pressable
                        key={cIdx}
                        onPress={handleAmountBackspace}
                        style={[
                          styles.keyCard,
                          {
                            backgroundColor: theme.raised,
                            borderColor: theme.rule,
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
                      onPress={() => handleAmountKey(val)}
                      style={[
                        styles.keyCard,
                        {
                          backgroundColor: theme.raised,
                          borderColor: theme.rule,
                        },
                      ]}
                    >
                      <Text style={[styles.keyText, { color: theme.ink }]}>{val}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>

          <Pressable
            onPress={handleConfirmAmount}
            style={({ pressed }) => [
              styles.continueButton,
              {
                backgroundColor: theme.accent,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
          >
            <Text style={[styles.continueText, { color: theme.onAccent }]}>Review & Send</Text>
          </Pressable>
        </View>
      )}

      {/* Step 3: PIN Confirmation */}
      {step === 'pin' && (
        <View style={styles.contentContainer}>
          <View style={styles.amountHeaderSection}>
            <Text style={[styles.sendingToText, { color: theme.ink2 }]}>
              Confirm Transfer
            </Text>
            <Text style={[styles.amountDisplay, { color: theme.ink }]}>
              ${amountInput}.00
            </Text>
            <Text style={[styles.cardDebitText, { color: theme.ink2 }]}>
              Enter your 4-digit security PIN
            </Text>

            {/* PIN 4 circles */}
            <View style={styles.pinCirclesRow}>
              {[0, 1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.pinCircle,
                    {
                      borderColor: i < pin.length ? theme.accent : theme.rule,
                      backgroundColor: i < pin.length ? theme.accent : 'transparent',
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* PIN Keypad */}
          <View style={styles.keypadWrapper}>
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
              ['', '0', 'backspace'],
            ].map((row, rIdx) => (
              <View key={rIdx} style={styles.keypadRow}>
                {row.map((val, cIdx) => {
                  if (val === '') return <View key={cIdx} style={styles.keyEmpty} />;
                  if (val === 'backspace') {
                    return (
                      <Pressable
                        key={cIdx}
                        onPress={handlePinBackspace}
                        style={[
                          styles.keyCard,
                          {
                            backgroundColor: theme.raised,
                            borderColor: theme.rule,
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
                      onPress={() => handlePinDigit(val)}
                      style={[
                        styles.keyCard,
                        {
                          backgroundColor: theme.raised,
                          borderColor: theme.rule,
                        },
                      ]}
                    >
                      <Text style={[styles.keyText, { color: theme.ink }]}>{val}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Step 4: Success */}
      {step === 'success' && (
        <View style={[styles.contentContainer, styles.successCenter]}>
          <View style={styles.successBadge}>
            <CheckCircle size={64} color={theme.positive} weight="fill" />
          </View>
          <Text style={[styles.successTitle, { color: theme.ink }]}>
            Transfer Sent
          </Text>
          <Text style={[styles.successSub, { color: theme.ink2 }]}>
            ${amountInput}.00 successfully transferred to {selectedRecipient?.name} ({selectedRecipient?.handle}).
          </Text>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.continueButton,
              {
                backgroundColor: theme.accent,
                opacity: pressed ? 0.88 : 1,
                marginTop: 32,
              },
            ]}
          >
            <Text style={[styles.continueText, { color: theme.onAccent }]}>Done</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeButton: {
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
  stepperRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stepperBar: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 16,
    borderWidth: 1,
  },
  atSymbol: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  recipientsList: {
    gap: 8,
    marginBottom: 14,
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  metaCol: {
    flex: 1,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  handleText: {
    fontSize: 13,
    fontWeight: '500',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addRecipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingVertical: 14,
    borderWidth: 1,
    gap: 8,
    marginTop: 4,
  },
  addRecipientText: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  continueButton: {
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  amountHeaderSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  sendingToText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  boldName: {
    fontWeight: '800',
  },
  amountDisplay: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
  },
  cardDebitText: {
    fontSize: 13,
    marginTop: 6,
  },
  pinCirclesRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  pinCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
  },
  keypadWrapper: {
    gap: 10,
    marginBottom: 16,
  },
  keypadRow: {
    flexDirection: 'row',
    gap: 10,
  },
  keyCard: {
    flex: 1,
    height: 58,
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
    fontSize: 24,
    fontWeight: '800',
  },
  successCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBadge: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  successSub: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
});
