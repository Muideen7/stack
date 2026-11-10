// app/(tabs)/index.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell } from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';

import { useWalletStore } from '../../store/walletStore';
import { useTransactionStore } from '../../store/transactionStore';
import { useAuthStore } from '../../store/authStore';
import { SpendRollup } from '../../utils/spendRollup';
import { CardFace } from '../../components/cards/CardFace';
import { QuickActions } from '../../components/home/QuickActions';
import { SpendingSummary } from '../../components/home/SpendingSummary';
import { RecentActivity } from '../../components/home/RecentActivity';
import { getTheme } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  const [refreshing, setRefreshing] = useState(false);

  const { cards } = useWalletStore();
  const { transactions } = useTransactionStore();
  const { profile } = useAuthStore();

  const spending = SpendRollup.fromTransactions(transactions, 'USD');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
          />
        }
      >
        {/* Header: Greeting & Notifications */}
        <View style={styles.headerRow}>
          <Text style={[styles.greetingText, { color: theme.ink2 }]}>
            Welcome, <Text style={[styles.nameBold, { color: theme.ink }]}>{profile.name}</Text>
          </Text>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/notifications');
            }}
            style={styles.bellButton}
          >
            <Bell
              size={22}
              color={theme.ink}
              weight="bold"
            />
            {/* Unread badge */}
            <View style={[styles.bellBadge, { backgroundColor: theme.accent }]}>
              <Text style={styles.bellBadgeText}>4</Text>
            </View>
          </Pressable>
        </View>

        {/* Total Unified Balance Section */}
        <View style={styles.balanceSection}>
          <Text style={[styles.balanceLabel, { color: theme.ink2 }]}>
            Total balance
          </Text>
          <View style={styles.amountRow}>
            <Text style={[styles.amountHero, { color: theme.ink }]}>
              $25,282<Text style={[styles.amountCents, { color: theme.ink2 }]}>.07</Text>
            </Text>
          </View>
        </View>

        {/* Your cards preview row */}
        <View style={styles.cardsSection}>
          <View style={styles.cardsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.ink }]}>
              Your cards
            </Text>
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/(tabs)/cards');
              }}
            >
              <Text style={[styles.seeAllLink, { color: theme.accent }]}>
                See all
              </Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsScroll}
          >
            {cards.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push('/(tabs)/cards');
                }}
                style={styles.cardPreviewItem}
              >
                <CardFace card={c} compact />
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions Row */}
        <View style={styles.sectionPad}>
          <QuickActions
            onSend={() => router.push('/send')}
            onConvert={() => router.push('/convert')}
            onAddCard={() => router.push('/add-card')}
            onMore={() => router.push('/transactions')}
          />
        </View>

        {/* Spent this week */}
        <View style={styles.sectionPad}>
          <SpendingSummary summary={spending} />
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionPad}>
          <RecentActivity
            transactions={transactions}
            onViewAll={() => router.push('/transactions')}
            onSelectTransaction={(tx) => router.push('/transactions')}
          />
        </View>
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
    paddingBottom: 6,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nameBold: {
    fontWeight: '800',
  },
  bellButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  balanceSection: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 16,
  },
  balanceLabel: {
    fontSize: 13.5,
    marginBottom: 4,
    fontWeight: '500',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  amountHero: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
  },
  amountCents: {
    fontSize: 32,
    fontWeight: '700',
  },
  cardsSection: {
    marginBottom: 10,
  },
  cardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  seeAllLink: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  cardsScroll: {
    paddingHorizontal: 24,
    gap: 12,
  },
  cardPreviewItem: {
    width: 195,
    height: 124,
  },
  sectionPad: {
    paddingHorizontal: 24,
  },
});
