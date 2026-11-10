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
  DotsThree,
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

export default function TransactionsScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

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
        isDark ? styles.canvasDark : styles.canvasLight,
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
            color={isDark ? '#F2F7F4' : '#0E1A13'}
            weight="bold"
          />
        </Pressable>

        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
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
              color={isDark ? '#F2F7F4' : '#0E1A13'}
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
              color={isDark ? '#F2F7F4' : '#0E1A13'}
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
            isDark ? styles.searchBarDark : styles.searchBarLight,
          ]}
        >
          <MagnifyingGlass
            size={18}
            color={isDark ? '#8A9C91' : '#6A7870'}
            weight="bold"
          />
          <TextInput
            placeholder="Search a merchant"
            placeholderTextColor={isDark ? '#8A9C91' : '#8A968E'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[
              styles.searchInput,
              isDark ? styles.searchInputDark : styles.searchInputLight,
            ]}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <X size={16} color={isDark ? '#8A9C91' : '#6A7870'} />
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
                <Text style={[styles.groupDateLabel, isDark && styles.groupDateLabelDark]}>
                  {group.label}
                </Text>
                <Text style={[styles.groupNetLabel, isDark && styles.groupNetLabelDark]}>
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
                      <View style={styles.itemLeftCol}>
                        <View
                          style={[
                            styles.iconBox,
                            isDark ? styles.iconBoxDark : styles.iconBoxLight,
                          ]}
                        >
                          <IconComp
                            size={20}
                            color={isDark ? '#A2B5A8' : '#3E4E44'}
                            weight="bold"
                          />
                        </View>
                        <View style={styles.metaCol}>
                          <Text
                            style={[styles.merchantTitle, isDark && styles.merchantTitleDark]}
                            numberOfLines={1}
                          >
                            {tx.merchant}
                          </Text>
                          <Text
                            style={[styles.categorySubtitle, isDark && styles.categorySubtitleDark]}
                          >
                            {tx.category} · •••• {last4}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.amountText,
                          isDark && styles.amountTextDark,
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

      {/* Filter Bottom Sheet Modal */}
      <TransactionFilterSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        selectedCard={filterCard}
        onChangeCard={setFilterCard}
        selectedCategory={selectedCategory}
        onChangeCategory={(cat) => setSelectedCategory(cat)}
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

      {/* Transaction Detail & Notes Modal */}
      {selectedTx && (
        <Modal visible={Boolean(selectedTx)} transparent animationType="slide">
          <View style={styles.detailModalRoot}>
            <Pressable
              style={styles.scrimBackdrop}
              onPress={() => setSelectedTx(null)}
            />
            <SafeAreaView
              edges={['bottom']}
              style={[
                styles.detailSheet,
                isDark ? styles.detailSheetDark : styles.detailSheetLight,
              ]}
            >
              <View style={styles.detailHeader}>
                <Text style={[styles.detailTitle, isDark && styles.detailTitleDark]}>
                  {selectedTx.merchant}
                </Text>
                <Pressable onPress={() => setSelectedTx(null)}>
                  <X size={20} color={isDark ? '#8A9C91' : '#5C6A61'} />
                </Pressable>
              </View>

              <Text style={[styles.detailAmount, isDark && styles.detailAmountDark]}>
                {Money.signed(selectedTx.amountMinor, selectedTx.currency)}
              </Text>

              <View style={styles.detailRowsCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailVal}>{selectedTx.category}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailVal}>
                    {new Date(selectedTx.occurredAt).toLocaleString()}
                  </Text>
                </View>
              </View>

              <Text style={styles.noteLabel}>NOTE</Text>
              <TextInput
                value={editingNote}
                onChangeText={setEditingNote}
                placeholder="Add note or receipt reference..."
                placeholderTextColor="#8A9C91"
                style={[
                  styles.noteInput,
                  isDark ? styles.noteInputDark : styles.noteInputLight,
                ]}
              />

              <Pressable
                onPress={handleSaveNote}
                style={[styles.saveNoteBtn, styles.saveNoteBtnLight]}
              >
                <Text style={styles.saveNoteBtnText}>Save</Text>
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
    paddingTop: 12,
    paddingBottom: 10,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrapper: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  searchBarLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E0D8',
  },
  searchBarDark: {
    backgroundColor: '#16201B',
    borderColor: '#26342B',
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    marginLeft: 10,
  },
  searchInputLight: {
    color: '#0E1A13',
  },
  searchInputDark: {
    color: '#F2F7F4',
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
    color: '#0E1A13',
  },
  groupDateLabelDark: {
    color: '#F2F7F4',
  },
  groupNetLabel: {
    fontSize: 12.5,
    color: '#5C6A61',
    fontWeight: '500',
  },
  groupNetLabelDark: {
    color: '#8A9C91',
  },
  itemsStack: {
    gap: 8,
  },
  txItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemLeftCol: {
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
  },
  iconBoxLight: {
    backgroundColor: '#EBE9E2',
  },
  iconBoxDark: {
    backgroundColor: '#202B24',
  },
  metaCol: {
    flex: 1,
  },
  merchantTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0E1A13',
    marginBottom: 2,
  },
  merchantTitleDark: {
    color: '#F2F7F4',
  },
  categorySubtitle: {
    fontSize: 12.5,
    color: '#5C6A61',
  },
  categorySubtitleDark: {
    color: '#8A9C91',
  },
  amountText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0E1A13',
  },
  amountTextDark: {
    color: '#F2F7F4',
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
  detailSheetLight: {
    backgroundColor: '#FFFFFF',
  },
  detailSheetDark: {
    backgroundColor: '#16201B',
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
    color: '#0E1A13',
  },
  detailTitleDark: {
    color: '#F2F7F4',
  },
  detailAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0E1A13',
    marginBottom: 16,
  },
  detailAmountDark: {
    color: '#F2F7F4',
  },
  detailRowsCard: {
    backgroundColor: '#F4F3EF',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
    color: '#5C6A61',
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0E1A13',
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#556159',
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
  noteInputLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E0D8',
    color: '#0E1A13',
  },
  noteInputDark: {
    backgroundColor: '#202B24',
    borderColor: '#2D3C33',
    color: '#F2F7F4',
  },
  saveNoteBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveNoteBtnLight: {
    backgroundColor: '#204E35',
  },
  saveNoteBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
