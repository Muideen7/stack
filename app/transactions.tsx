// app/transactions.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MagnifyingGlass,
  Funnel,
  Plus,
  Receipt,
  Train,
  Coffee,
  ShoppingBag,
  ArrowUpRight,
  X,
  CreditCard,
  Clock,
  Note,
} from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';

import { useTransactionStore } from '../store/transactionStore';
import { useWalletStore } from '../store/walletStore';
import { Transaction } from '../types/models';
import { Money } from '../utils/money';
import { TxnGrouping } from '../utils/txnGrouping';
import { TransactionFilterSheet } from '../components/transactions/TransactionFilterSheet';
import { getTheme } from '../constants/theme';

export default function TransactionsScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  const {
    transactions,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    updateTransaction,
  } = useTransactionStore();

  const { cards } = useWalletStore();

  const [filterVisible, setFilterVisible] = useState(false);
  const [filterCard, setFilterCard] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [editingNote, setEditingNote] = useState('');

  // Map cardId to last4
  const cardLast4Map = React.useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of cards) {
      map[c.id] = c.last4;
    }
    return map;
  }, [cards]);

  // Filter transactions
  const filtered = transactions.filter((t) => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) {
      return false;
    }
    if (filterCard !== 'all' && t.cardId !== filterCard) {
      return false;
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchesMerchant = t.merchant.toLowerCase().includes(q);
      const matchesCategory = t.category.toLowerCase().includes(q);
      const matchesNote = t.note?.toLowerCase().includes(q) ?? false;
      if (!matchesMerchant && !matchesCategory && !matchesNote) return false;
    }
    return true;
  });

  const dayGroups = TxnGrouping.byDay(filtered);

  const getIcon = (merchant: string, category: string) => {
    if (merchant.toLowerCase().includes('rail') || category === 'Transport') {
      return Train;
    }
    if (merchant.toLowerCase().includes('coffee') || category === 'Food') {
      return Coffee;
    }
    if (category === 'Shopping' || category === 'Groceries') {
      return ShoppingBag;
    }
    if (category === 'Transfers' || merchant.toLowerCase().includes('to ')) {
      return ArrowUpRight;
    }
    return Receipt;
  };

  const handleOpenDetail = (tx: Transaction) => {
    Haptics.selectionAsync();
    setSelectedTx(tx);
    setEditingNote(tx.note || '');
  };

  const handleSaveNote = () => {
    if (selectedTx) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      updateTransaction(selectedTx.id, { note: editingNote.trim() || null });
      setSelectedTx({ ...selectedTx, note: editingNote.trim() || null });
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
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <ArrowLeft
            size={22}
            color={theme.ink}
            weight="bold"
          />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.ink }]}>
          Activity
        </Text>

        <View style={styles.headerActions}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFilterVisible(true);
            }}
            style={styles.iconButton}
          >
            <Funnel
              size={20}
              color={theme.ink}
              weight="bold"
            />
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/send');
            }}
            style={styles.iconButton}
          >
            <Plus
              size={22}
              color={theme.ink}
              weight="bold"
            />
          </Pressable>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchWrapper}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.raised,
              borderColor: theme.rule,
            },
          ]}
        >
          <MagnifyingGlass
            size={18}
            color={theme.ink2}
            weight="bold"
          />
          <TextInput
            placeholder="Search a merchant"
            placeholderTextColor={theme.ink3}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[
              styles.searchInput,
              { color: theme.ink },
            ]}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <X size={16} color={theme.ink2} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Grouped Activity List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dayGroups.map((group) => {
          const netLabel = `Net ${Money.signed(group.netMinor, group.currency)}`;

          return (
            <View key={group.label} style={styles.groupSection}>
              {/* Group Header Row */}
              <View style={styles.groupHeaderRow}>
                <Text style={[styles.groupDateLabel, { color: theme.ink }]}>
                  {group.label}
                </Text>
                <Text style={[styles.groupNetLabel, { color: theme.ink2 }]}>
                  {netLabel}
                </Text>
              </View>

              {/* Transactions in Group */}
              <View style={styles.itemsStack}>
                {group.items.map((tx) => {
                  const IconComp = getIcon(tx.merchant, tx.category);
                  const last4 = cardLast4Map[tx.cardId] || '8152';

                  return (
                    <Pressable
                      key={tx.id}
                      onPress={() => handleOpenDetail(tx)}
                      style={({ pressed }) => [
                        styles.txItemRow,
                        { opacity: pressed ? 0.75 : 1 },
                      ]}
                    >
                      <View style={styles.leftGroup}>
                        <View
                          style={[
                            styles.iconBox,
                            {
                              backgroundColor: theme.raisedSubtle,
                              borderColor: theme.rule,
                            },
                          ]}
                        >
                          <IconComp
                            size={20}
                            color={theme.ink}
                            weight="bold"
                          />
                        </View>
                        <View style={styles.metaCol}>
                          <Text style={[styles.merchantTitle, { color: theme.ink }]} numberOfLines={1}>
                            {tx.merchant}
                          </Text>
                          <Text style={[styles.categorySubtitle, { color: theme.ink2 }]}>
                            {tx.category} · •••• {last4}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.amountText,
                          {
                            color: tx.amountMinor > 0 ? theme.positive : theme.ink,
                          },
                        ]}
                      >
                        {Money.signed(tx.amountMinor, tx.currency)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Filter Bottom Sheet */}
      <TransactionFilterSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        selectedCard={filterCard}
        onChangeCard={setFilterCard}
        selectedCategory={selectedCategory}
        onChangeCategory={setSelectedCategory}
        selectedDateRange={filterDateRange}
        onChangeDateRange={setFilterDateRange}
        onApply={() => setFilterVisible(false)}
        onClear={() => {
          setFilterCard('all');
          setSelectedCategory('All');
          setFilterDateRange('all');
          setFilterVisible(false);
        }}
      />

      {/* Transaction Detail Bottom Sheet Modal */}
      {selectedTx && (
        <Modal visible transparent animationType="slide">
          <View style={styles.detailModalRoot}>
            <Pressable
              style={styles.scrimBackdrop}
              onPress={() => setSelectedTx(null)}
            />
            <SafeAreaView
              edges={['bottom']}
              style={[
                styles.detailSheet,
                {
                  backgroundColor: theme.raised,
                },
              ]}
            >
              <View style={styles.detailHeader}>
                <Text style={[styles.detailTitle, { color: theme.ink }]}>
                  {selectedTx.merchant}
                </Text>
                <Pressable onPress={() => setSelectedTx(null)}>
                  <X size={20} color={theme.ink2} />
                </Pressable>
              </View>

              <Text
                style={[
                  styles.detailAmount,
                  { color: selectedTx.amountMinor > 0 ? theme.positive : theme.ink },
                ]}
              >
                {Money.signed(selectedTx.amountMinor, selectedTx.currency)}
              </Text>

              {/* Detail fields card */}
              <View
                style={[
                  styles.detailRowsCard,
                  {
                    backgroundColor: theme.raisedSubtle,
                    borderColor: theme.rule,
                  },
                ]}
              >
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.ink2 }]}>Category</Text>
                  <Text style={[styles.detailVal, { color: theme.ink }]}>{selectedTx.category}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.ink2 }]}>Card</Text>
                  <Text style={[styles.detailVal, { color: theme.ink }]}>
                    •••• {cardLast4Map[selectedTx.cardId] || '8152'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.ink2 }]}>Date</Text>
                  <Text style={[styles.detailVal, { color: theme.ink }]}>
                    {new Date(selectedTx.occurredAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {/* Note input field */}
              <Text style={[styles.noteLabel, { color: theme.ink2 }]}>NOTE</Text>
              <TextInput
                value={editingNote}
                onChangeText={setEditingNote}
                placeholder="Add a memo..."
                placeholderTextColor={theme.ink3}
                style={[
                  styles.noteInput,
                  {
                    backgroundColor: theme.raised,
                    borderColor: theme.rule,
                    color: theme.ink,
                  },
                ]}
              />

              <Pressable
                onPress={handleSaveNote}
                style={({ pressed }) => [
                  styles.saveNoteBtn,
                  {
                    backgroundColor: theme.accent,
                    opacity: pressed ? 0.88 : 1,
                  },
                ]}
              >
                <Text style={[styles.saveNoteBtnText, { color: theme.onAccent }]}>Save Note</Text>
              </Pressable>
            </SafeAreaView>
          </View>
        </Modal>
      )}
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
  iconButton: {
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchWrapper: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 16,
    paddingHorizontal: 16,
    gap: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  groupSection: {
    marginBottom: 20,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  groupDateLabel: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.1,
  },
  groupNetLabel: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  itemsStack: {
    gap: 12,
  },
  txItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
  },
  metaCol: {
    flex: 1,
  },
  merchantTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 12.5,
  },
  amountText: {
    fontSize: 15.5,
    fontWeight: '800',
  },
  detailModalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  scrimBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  detailSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  detailAmount: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
  },
  detailRowsCard: {
    borderRadius: 18,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  noteInput: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  saveNoteBtn: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveNoteBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
