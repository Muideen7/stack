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
  ArrowRight,
  Backspace,
} from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';

import { useWalletStore } from '../store/walletStore';
import { useRecipientStore } from '../store/recipientStore';
import { useTransactionStore } from '../store/transactionStore';
import { Recipient } from '../types/models';
import { Money } from '../utils/money';

export default function SendScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

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
        isDark ? styles.canvasDark : styles.canvasLight,
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
            <X size={22} color={isDark ? '#F2F7F4' : '#0E1A13'} weight="bold" />
          </Pressable>

          <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
            {step === 'recipient' && 'Send to'}
            {step === 'amount' && 'Amount'}
            {step === 'pin' && 'Enter PIN'}
            {step === 'success' && 'Sent'}
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* 4-step progress indicator bar matching reference */}
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
                  isCompletedOrActive
                    ? (isDark ? styles.stepperActiveDark : styles.stepperActiveLight)
                    : (isDark ? styles.stepperInactiveDark : styles.stepperInactiveLight),
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
              isDark ? styles.searchBoxDark : styles.searchBoxLight,
            ]}
          >
            <Text style={[styles.atSymbol, isDark && styles.atSymbolDark]}>@</Text>
            <TextInput
              placeholder="Handle, email or name"
              placeholderTextColor={isDark ? '#8A9C91' : '#8A968E'}
              value={search}
              onChangeText={setSearch}
              style={[
                styles.searchInput,
                isDark ? styles.searchInputDark : styles.searchInputLight,
              ]}
            />
          </View>

          {/* Section: Recent */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            <Text style={[styles.sectionLabel, isDark && styles.sectionLabelDark]}>
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
                      isSelected && (isDark ? styles.rowSelectedDark : styles.rowSelectedLight),
                    ]}
                  >
                    {/* Circle Avatar */}
                    <View
                      style={[
                        styles.avatarCircle,
                        isDark ? styles.avatarDark : styles.avatarLight,
                      ]}
                    >
                      <Text
                        style={[
                          styles.avatarText,
                          isDark ? styles.avatarTextDark : styles.avatarTextLight,
                        ]}
                      >
                        {initials}
                      </Text>
                    </View>

                    {/* Metadata */}
                    <View style={styles.metaCol}>
                      <Text style={[styles.nameText, isDark && styles.nameTextDark]}>
                        {r.name}
                      </Text>
                      <Text style={[styles.handleText, isDark && styles.handleTextDark]}>
                        {r.handle}
                      </Text>
                    </View>

                    {/* Right action icons */}
                    <View style={styles.rightActions}>
                      {!r.verified && (
                        <Info size={18} color="#B45309" weight="bold" />
                      )}
                      <DotsThree
                        size={22}
                        color={isDark ? '#8A9C91' : '#5C6A61'}
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
                isDark ? styles.addRecipientDark : styles.addRecipientLight,
              ]}
            >
              <UserPlus
                size={20}
                color={isDark ? '#F2F7F4' : '#0E1A13'}
                weight="bold"
              />
              <Text
                style={[
                  styles.addRecipientText,
                  isDark && styles.addRecipientTextDark,
                ]}
              >
                Add a recipient
              </Text>
            </Pressable>
          </ScrollView>

          {/* Bottom Primary Button */}
          <Pressable
            onPress={handleContinueToAmount}
            style={({ pressed }) => [
              styles.continueButton,
              isDark ? styles.continueBtnDark : styles.continueBtnLight,
              { opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Text style={styles.continueText}>Continue</Text>
          </Pressable>
        </View>
      )}

      {/* Step 2: Amount Entry */}
      {step === 'amount' && (
        <View style={styles.contentContainer}>
          <View style={styles.amountHeaderSection}>
            <Text style={[styles.sendingToText, isDark && styles.sendingToDark]}>
              Sending to <Text style={styles.boldWhite}>{selectedRecipient?.name}</Text>
            </Text>
            <Text style={[styles.amountDisplay, isDark && styles.amountDisplayDark]}>
              ${amountInput}.00
            </Text>
            <Text style={[styles.cardDebitText, isDark && styles.cardDebitDark]}>
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
                        style={styles.keyCard}
                      >
                        <Backspace size={24} color="#0E1A13" />
                      </Pressable>
                    );
                  }
                  return (
                    <Pressable
                      key={cIdx}
                      onPress={() => handleAmountKey(val)}
                      style={styles.keyCard}
                    >
                      <Text style={styles.keyText}>{val}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>

          <Pressable
            onPress={handleConfirmAmount}
            style={[styles.continueButton, styles.continueBtnLight]}
          >
            <Text style={styles.continueText}>Review & Send</Text>
          </Pressable>
        </View>
      )}

      {/* Step 3: PIN Confirmation */}
      {step === 'pin' && (
        <View style={styles.contentContainer}>
          <View style={styles.amountHeaderSection}>
            <Text style={[styles.sendingToText, isDark && styles.sendingToDark]}>
              Confirm Transfer
            </Text>
            <Text style={[styles.amountDisplay, isDark && styles.amountDisplayDark]}>
              ${amountInput}.00
            </Text>
            <Text style={[styles.cardDebitText, isDark && styles.cardDebitDark]}>
              Enter your 4-digit security PIN
            </Text>

            {/* PIN 4 circles */}
            <View style={styles.pinCirclesRow}>
              {[0, 1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.pinCircle,
                    i < pin.length && styles.pinCircleFilled,
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
                        style={styles.keyCard}
                      >
                        <Backspace size={24} color="#0E1A13" />
                      </Pressable>
                    );
                  }
                  return (
                    <Pressable
                      key={cIdx}
                      onPress={() => handlePinDigit(val)}
                      style={styles.keyCard}
                    >
                      <Text style={styles.keyText}>{val}</Text>
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
            <CheckCircle size={64} color="#204E35" weight="fill" />
          </View>
          <Text style={[styles.successTitle, isDark && styles.successTitleDark]}>
            Transfer Sent!
          </Text>
          <Text style={[styles.successSub, isDark && styles.successSubDark]}>
            ${amountInput}.00 has been sent to {selectedRecipient?.name}.
          </Text>

          <Pressable
            onPress={() => router.back()}
            style={[styles.continueButton, styles.continueBtnLight, { width: '100%', marginTop: 32 }]}
          >
            <Text style={styles.continueText}>Done</Text>
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
  canvasLight: {
    backgroundColor: '#F4F3EF',
  },
  canvasDark: {
    backgroundColor: '#0E1612',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeButton: {
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
  stepperRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  stepperBar: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
  },
  stepperActiveLight: {
    backgroundColor: '#204E35',
  },
  stepperActiveDark: {
    backgroundColor: '#4ADE80',
  },
  stepperInactiveLight: {
    backgroundColor: '#E2E0D6',
  },
  stepperInactiveDark: {
    backgroundColor: '#26342B',
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
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginTop: 6,
    marginBottom: 10,
  },
  searchBoxLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E0D8',
  },
  searchBoxDark: {
    backgroundColor: '#16201B',
    borderColor: '#26342B',
  },
  atSymbol: {
    fontSize: 17,
    fontWeight: '700',
    color: '#5C6A61',
    marginRight: 10,
  },
  atSymbolDark: {
    color: '#8A9C91',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  searchInputLight: {
    color: '#0E1A13',
  },
  searchInputDark: {
    color: '#F2F7F4',
  },
  listContent: {
    paddingBottom: 16,
  },
  sectionLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#5C6A61',
    marginBottom: 8,
    paddingLeft: 4,
  },
  sectionLabelDark: {
    color: '#8A9C91',
  },
  recipientsList: {
    gap: 4,
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  rowSelectedLight: {
    backgroundColor: '#E2EDE6',
  },
  rowSelectedDark: {
    backgroundColor: '#1E3527',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarLight: {
    backgroundColor: '#D6E6DC',
  },
  avatarDark: {
    backgroundColor: '#1C3827',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
  },
  avatarTextLight: {
    color: '#204E35',
  },
  avatarTextDark: {
    color: '#4ADE80',
  },
  metaCol: {
    flex: 1,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0E1A13',
    marginBottom: 2,
  },
  nameTextDark: {
    color: '#F2F7F4',
  },
  handleText: {
    fontSize: 13,
    color: '#5C6A61',
  },
  handleTextDark: {
    color: '#8A9C91',
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
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
    gap: 10,
  },
  addRecipientLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E0D8',
  },
  addRecipientDark: {
    backgroundColor: '#16201B',
    borderColor: '#26342B',
  },
  addRecipientText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0E1A13',
  },
  addRecipientTextDark: {
    color: '#F2F7F4',
  },
  continueButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  continueBtnLight: {
    backgroundColor: '#204E35',
  },
  continueBtnDark: {
    backgroundColor: '#225B3C',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  amountHeaderSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  sendingToText: {
    fontSize: 14,
    color: '#5C6A61',
    marginBottom: 6,
  },
  sendingToDark: {
    color: '#8A9C91',
  },
  boldWhite: {
    fontWeight: '700',
    color: '#0E1A13',
  },
  amountDisplay: {
    fontSize: 44,
    fontWeight: '800',
    color: '#0E1A13',
    letterSpacing: -1,
  },
  amountDisplayDark: {
    color: '#F2F7F4',
  },
  cardDebitText: {
    fontSize: 13,
    color: '#5C6A61',
    marginTop: 4,
  },
  cardDebitDark: {
    color: '#8A9C91',
  },
  pinCirclesRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  pinCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#738077',
  },
  pinCircleFilled: {
    backgroundColor: '#204E35',
    borderColor: '#204E35',
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
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E0D8',
  },
  keyEmpty: {
    flex: 1,
  },
  keyText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0E1A13',
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
    color: '#0E1A13',
    marginBottom: 8,
  },
  successTitleDark: {
    color: '#F2F7F4',
  },
  successSub: {
    fontSize: 15,
    color: '#5C6A61',
    textAlign: 'center',
    lineHeight: 22,
  },
  successSubDark: {
    color: '#8A9C91',
  },
});
