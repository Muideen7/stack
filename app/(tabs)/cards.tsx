// app/(tabs)/cards.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, DotsThree, CopySimple, Cards, Wallet } from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';

import { useWalletStore } from '../../store/walletStore';
import { CardCarousel } from '../../components/cards/CardCarousel';
import { WalletStack } from '../../components/cards/WalletStack';
import { Money } from '../../utils/money';
import { getTheme } from '../../constants/theme';

export default function CardsScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  const [layoutMode, setLayoutMode] = useState<'carousel' | 'wallet'>('wallet');

  const { cards, activeCardIndex, setActiveCardIndex } = useWalletStore();
  const currentCard = cards[activeCardIndex] || cards[0];

  const handleCopyNumber = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const expiry = currentCard
    ? `${String(currentCard.expiryMonth).padStart(2, '0')}/${String(currentCard.expiryYear).slice(-2)}`
    : '07/29';

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.ground },
      ]}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header: Title + Add & More buttons */}
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: theme.ink }]}>
            Cards
          </Text>

          <View style={styles.headerActions}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/add-card');
              }}
              style={styles.iconButton}
            >
              <Plus
                size={22}
                color={theme.ink}
                weight="bold"
              />
            </Pressable>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(auth)/demo-settings');
              }}
              style={styles.iconButton}
            >
              <DotsThree
                size={24}
                color={theme.ink}
                weight="bold"
              />
            </Pressable>
          </View>
        </View>

        {/* Segmented Mode Toggle (Carousel vs Wallet) */}
        <View style={styles.toggleWrapper}>
          <View
            style={[
              styles.segmentedContainer,
              {
                backgroundColor: theme.raisedSubtle,
                borderColor: theme.rule,
              },
            ]}
          >
            {/* Carousel Option */}
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                setLayoutMode('carousel');
              }}
              style={[
                styles.segmentItem,
                layoutMode === 'carousel' && [
                  styles.segmentActive,
                  { backgroundColor: theme.raised, borderColor: theme.rule },
                ],
              ]}
            >
              <Cards
                size={18}
                color={layoutMode === 'carousel' ? theme.accent : theme.ink2}
                weight={layoutMode === 'carousel' ? 'bold' : 'regular'}
              />
              <Text
                style={[
                  styles.segmentText,
                  { color: layoutMode === 'carousel' ? theme.ink : theme.ink2 },
                ]}
              >
                Carousel
              </Text>
            </Pressable>

            {/* Wallet Option */}
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                setLayoutMode('wallet');
              }}
              style={[
                styles.segmentItem,
                layoutMode === 'wallet' && [
                  styles.segmentActive,
                  { backgroundColor: theme.raised, borderColor: theme.rule },
                ],
              ]}
            >
              <Wallet
                size={18}
                color={layoutMode === 'wallet' ? theme.accent : theme.ink2}
                weight={layoutMode === 'wallet' ? 'bold' : 'regular'}
              />
              <Text
                style={[
                  styles.segmentText,
                  { color: layoutMode === 'wallet' ? theme.ink : theme.ink2 },
                ]}
              >
                Wallet
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Display depending on segmented toggle */}
        {layoutMode === 'wallet' ? (
          <View style={styles.walletContainer}>
            <WalletStack
              cards={cards}
              selectedIndex={activeCardIndex}
              onSelectCard={(idx) => {
                setActiveCardIndex(idx);
                setLayoutMode('carousel');
              }}
              onAddCard={() => router.push('/add-card')}
            />
          </View>
        ) : (
          <View style={styles.carouselContainer}>
            <CardCarousel
              cards={cards}
              activeIndex={activeCardIndex}
              onFocusChange={setActiveCardIndex}
            />

            {/* Dedicated Card Balance */}
            {currentCard && (
              <View style={styles.cardBalanceSection}>
                <Text style={[styles.cardBalanceAmount, { color: theme.ink }]}>
                  {Money.format(currentCard.balanceMinor, currentCard.currency)}
                </Text>
                <Text style={[styles.cardBalanceSubtitle, { color: theme.ink2 }]}>
                  {currentCard.nickname} · {currentCard.brand.toUpperCase()}
                </Text>
              </View>
            )}

            {/* Card Information Sheet Block */}
            {currentCard && (
              <View style={styles.infoWrapper}>
                <Text style={[styles.infoSectionTitle, { color: theme.ink }]}>
                  Card details
                </Text>

                <View
                  style={[
                    styles.infoCard,
                    {
                      backgroundColor: theme.raised,
                      borderColor: theme.rule,
                    },
                  ]}
                >
                  {/* Card Number Row */}
                  <View style={styles.infoRow}>
                    <View>
                      <Text style={[styles.infoLabel, { color: theme.ink2 }]}>Card number</Text>
                      <Text style={[styles.infoValue, { color: theme.ink }]}>
                        •••• •••• •••• {currentCard.last4}
                      </Text>
                    </View>
                    <Pressable onPress={handleCopyNumber} style={styles.copyButton}>
                      <CopySimple size={20} color={theme.accent} weight="bold" />
                    </Pressable>
                  </View>

                  <View style={[styles.divider, { backgroundColor: theme.rule }]} />

                  {/* Expiry & CVV Row */}
                  <View style={styles.twoColRow}>
                    <View style={styles.col}>
                      <Text style={[styles.infoLabel, { color: theme.ink2 }]}>Expires</Text>
                      <Text style={[styles.infoValue, { color: theme.ink }]}>{expiry}</Text>
                    </View>
                    <View style={styles.col}>
                      <Text style={[styles.infoLabel, { color: theme.ink2 }]}>CVV</Text>
                      <Text style={[styles.infoValue, { color: theme.ink }]}>•••</Text>
                    </View>
                  </View>

                  <View style={[styles.divider, { backgroundColor: theme.rule }]} />

                  {/* Cardholder & Type Row */}
                  <View style={styles.twoColRow}>
                    <View style={styles.col}>
                      <Text style={[styles.infoLabel, { color: theme.ink2 }]}>Cardholder</Text>
                      <Text style={[styles.infoValue, { color: theme.ink }]}>{currentCard.holder}</Text>
                    </View>
                    <View style={styles.col}>
                      <Text style={[styles.infoLabel, { color: theme.ink2 }]}>Type</Text>
                      <Text style={[styles.infoValue, styles.capitalize, { color: theme.ink }]}>
                        {currentCard.funding}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.divider, { backgroundColor: theme.rule }]} />

                  {/* Status & Spend Limit */}
                  <View style={styles.twoColRow}>
                    <View style={styles.col}>
                      <Text style={[styles.infoLabel, { color: theme.ink2 }]}>Status</Text>
                      <Text
                        style={[
                          styles.infoValue,
                          { color: currentCard.frozen ? theme.negative : theme.positive },
                        ]}
                      >
                        {currentCard.frozen ? 'Frozen' : 'Active'}
                      </Text>
                    </View>
                    <View style={styles.col}>
                      <Text style={[styles.infoLabel, { color: theme.ink2 }]}>Monthly limit</Text>
                      <Text style={[styles.infoValue, { color: theme.ink }]}>
                        {currentCard.spendLimitMinor
                          ? Money.format(currentCard.spendLimitMinor, currentCard.currency)
                          : 'None'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleWrapper: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  segmentedContainer: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 4,
    borderWidth: 1,
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  segmentActive: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  walletContainer: {
    paddingHorizontal: 24,
  },
  carouselContainer: {
    paddingBottom: 24,
  },
  cardBalanceSection: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  cardBalanceAmount: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  cardBalanceSubtitle: {
    fontSize: 13.5,
    fontWeight: '500',
    marginTop: 4,
  },
  infoWrapper: {
    paddingHorizontal: 24,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  infoCard: {
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  twoColRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  col: {
    flex: 1,
  },
  copyButton: {
    padding: 6,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
  },
});
