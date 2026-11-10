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

export default function CardsScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

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
        isDark ? styles.canvasDark : styles.canvasLight,
      ]}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header: Title + Add & More buttons */}
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
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
                color={isDark ? '#F0F5F2' : '#0E1A13'}
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
                color={isDark ? '#F0F5F2' : '#0E1A13'}
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
              isDark ? styles.segmentedDark : styles.segmentedLight,
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
                layoutMode === 'carousel' && (isDark ? styles.segmentActiveDark : styles.segmentActiveLight),
              ]}
            >
              <Cards
                size={18}
                color={
                  layoutMode === 'carousel'
                    ? (isDark ? '#4ADE80' : '#0E1A13')
                    : (isDark ? '#8A9B91' : '#5C6A61')
                }
                weight={layoutMode === 'carousel' ? 'bold' : 'regular'}
              />
              <Text
                style={[
                  styles.segmentText,
                  layoutMode === 'carousel'
                    ? (isDark ? styles.segmentTextActiveDark : styles.segmentTextActiveLight)
                    : (isDark ? styles.segmentTextInactiveDark : styles.segmentTextInactiveLight),
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
                layoutMode === 'wallet' && (isDark ? styles.segmentActiveDark : styles.segmentActiveLight),
              ]}
            >
              <Wallet
                size={18}
                color={
                  layoutMode === 'wallet'
                    ? (isDark ? '#4ADE80' : '#0E1A13')
                    : (isDark ? '#8A9B91' : '#5C6A61')
                }
                weight={layoutMode === 'wallet' ? 'bold' : 'regular'}
              />
              <Text
                style={[
                  styles.segmentText,
                  layoutMode === 'wallet'
                    ? (isDark ? styles.segmentTextActiveDark : styles.segmentTextActiveLight)
                    : (isDark ? styles.segmentTextInactiveDark : styles.segmentTextInactiveLight),
                ]}
              >
                Wallet
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Main Content Area */}
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
            {/* Interactive Carousel */}
            <CardCarousel
              cards={cards}
              activeIndex={activeCardIndex}
              onFocusChange={setActiveCardIndex}
            />

            {/* Selected Card Balance */}
            {currentCard && (
              <View style={styles.cardBalanceSection}>
                <Text
                  style={[
                    styles.cardBalanceAmount,
                    isDark && styles.cardBalanceAmountDark,
                  ]}
                >
                  {Money.format(currentCard.balanceMinor, currentCard.currency)}
                </Text>
                <Text
                  style={[
                    styles.cardBalanceSubtitle,
                    isDark && styles.cardBalanceSubtitleDark,
                  ]}
                >
                  {currentCard.funding === 'credit' ? 'Credit' : 'Debit'} · •••• {currentCard.last4}
                </Text>
              </View>
            )}

            {/* Card Info Section */}
            {currentCard && (
              <View style={styles.infoWrapper}>
                <Text style={[styles.infoSectionTitle, isDark && styles.infoSectionTitleDark]}>
                  Card info
                </Text>

                <View
                  style={[
                    styles.infoCard,
                    isDark ? styles.infoCardDark : styles.infoCardLight,
                  ]}
                >
                  {/* Row 1: Card number with copy button */}
                  <View style={styles.infoRow}>
                    <View>
                      <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>
                        Card number
                      </Text>
                      <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
                        •••• •••• •••• {currentCard.last4}
                      </Text>
                    </View>
                    <Pressable onPress={handleCopyNumber} style={styles.copyButton}>
                      <CopySimple
                        size={18}
                        color={isDark ? '#8A9C91' : '#5C6A61'}
                        weight="regular"
                      />
                    </Pressable>
                  </View>

                  <View style={[styles.divider, isDark && styles.dividerDark]} />

                  {/* Row 2: Expires & Network */}
                  <View style={styles.twoColRow}>
                    <View style={styles.col}>
                      <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>
                        Expires
                      </Text>
                      <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
                        {expiry}
                      </Text>
                    </View>
                    <View style={styles.col}>
                      <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>
                        Network
                      </Text>
                      <Text
                        style={[
                          styles.infoValue,
                          styles.capitalize,
                          isDark && styles.infoValueDark,
                        ]}
                      >
                        {currentCard.brand === 'mastercard' ? 'Mastercard' : 'Visa'}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.divider, isDark && styles.dividerDark]} />

                  {/* Row 3: Cardholder */}
                  <View style={styles.infoRow}>
                    <View>
                      <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>
                        Cardholder
                      </Text>
                      <Text
                        style={[
                          styles.infoValue,
                          styles.uppercase,
                          isDark && styles.infoValueDark,
                        ]}
                      >
                        {currentCard.holder}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.divider, isDark && styles.dividerDark]} />

                  {/* Row 4: Status & Monthly limit */}
                  <View style={styles.twoColRow}>
                    <View style={styles.col}>
                      <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>
                        Status
                      </Text>
                      <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
                        {currentCard.frozen ? 'Frozen' : 'Active'}
                      </Text>
                    </View>
                    <View style={styles.col}>
                      <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>
                        Monthly limit
                      </Text>
                      <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
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
  canvasLight: {
    backgroundColor: '#F4F3EF',
  },
  canvasDark: {
    backgroundColor: '#0E1612',
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
    color: '#0E1A13',
    letterSpacing: -0.5,
  },
  headerTitleDark: {
    color: '#F2F7F4',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    width: 36,
    height: 36,
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
  },
  segmentedLight: {
    backgroundColor: '#EBE9E2',
  },
  segmentedDark: {
    backgroundColor: '#1E2822',
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
  segmentActiveLight: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  segmentActiveDark: {
    backgroundColor: '#26362D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  segmentTextActiveLight: {
    color: '#0E1A13',
  },
  segmentTextActiveDark: {
    color: '#F2F7F4',
  },
  segmentTextInactiveLight: {
    color: '#5C6A61',
  },
  segmentTextInactiveDark: {
    color: '#8A9C91',
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
    color: '#0E1A13',
    letterSpacing: -0.6,
  },
  cardBalanceAmountDark: {
    color: '#F2F7F4',
  },
  cardBalanceSubtitle: {
    fontSize: 13.5,
    color: '#5C6A61',
    fontWeight: '500',
    marginTop: 4,
  },
  cardBalanceSubtitleDark: {
    color: '#8A9C91',
  },
  infoWrapper: {
    paddingHorizontal: 24,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0E1A13',
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  infoSectionTitleDark: {
    color: '#F2F7F4',
  },
  infoCard: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  infoCardLight: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ECEAE4',
  },
  infoCardDark: {
    backgroundColor: '#16201B',
    borderWidth: 1,
    borderColor: '#26342B',
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
    color: '#5C6A61',
    fontWeight: '500',
    marginBottom: 3,
  },
  infoLabelDark: {
    color: '#8A9C91',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0E1A13',
  },
  infoValueDark: {
    color: '#F2F7F4',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#ECEAE4',
  },
  dividerDark: {
    backgroundColor: '#26342B',
  },
});

