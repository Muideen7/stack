// components/transactions/TransactionFilterSheet.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Funnel, CaretUpDown } from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';
import { SpendCategory } from '../../types/models';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedCard: string; // 'all' or cardId
  onChangeCard: (card: string) => void;
  selectedCategory: SpendCategory | 'All';
  onChangeCategory: (cat: SpendCategory | 'All') => void;
  selectedDateRange: string; // 'all', 'week', 'month'
  onChangeDateRange: (range: string) => void;
  onApply: () => void;
  onClear: () => void;
}

const CARDS_OPTIONS = [
  { id: 'all', label: 'All cards' },
  { id: 'c_forest', label: 'Everyday (•••• 8152)' },
  { id: 'c_moss', label: 'Travel (•••• 4410)' },
  { id: 'c_sage', label: 'Household (•••• 7731)' },
];

const CATEGORIES_OPTIONS: { id: SpendCategory | 'All'; label: string }[] = [
  { id: 'All', label: 'All categories' },
  { id: 'Food', label: 'Food' },
  { id: 'Groceries', label: 'Groceries' },
  { id: 'Transport', label: 'Transport' },
  { id: 'Transfers', label: 'Transfers' },
  { id: 'Shopping', label: 'Shopping' },
];

const DATES_OPTIONS = [
  { id: 'all', label: 'Any time' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
];

export const TransactionFilterSheet: React.FC<FilterSheetProps> = ({
  visible,
  onClose,
  selectedCard,
  onChangeCard,
  selectedCategory,
  onChangeCategory,
  selectedDateRange,
  onChangeDateRange,
  onApply,
  onClear,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (!visible) return null;

  const currentCardLabel =
    CARDS_OPTIONS.find((c) => c.id === selectedCard)?.label || 'All cards';
  const currentCategoryLabel =
    CATEGORIES_OPTIONS.find((c) => c.id === selectedCategory)?.label || 'All categories';
  const currentDateLabel =
    DATES_OPTIONS.find((d) => d.id === selectedDateRange)?.label || 'Any time';

  const cycleCard = () => {
    Haptics.selectionAsync();
    const idx = CARDS_OPTIONS.findIndex((c) => c.id === selectedCard);
    const next = CARDS_OPTIONS[(idx + 1) % CARDS_OPTIONS.length].id;
    onChangeCard(next);
  };

  const cycleCategory = () => {
    Haptics.selectionAsync();
    const idx = CATEGORIES_OPTIONS.findIndex((c) => c.id === selectedCategory);
    const next = CATEGORIES_OPTIONS[(idx + 1) % CATEGORIES_OPTIONS.length].id;
    onChangeCategory(next);
  };

  const cycleDateRange = () => {
    Haptics.selectionAsync();
    const idx = DATES_OPTIONS.findIndex((d) => d.id === selectedDateRange);
    const next = DATES_OPTIONS[(idx + 1) % DATES_OPTIONS.length].id;
    onChangeDateRange(next);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalRoot}>
        {/* Scrim backdrop */}
        <Pressable style={styles.scrimBackdrop} onPress={onClose} />

        {/* Bottom Sheet */}
        <SafeAreaView
          edges={['bottom']}
          style={[
            styles.sheetContainer,
            isDark ? styles.sheetDark : styles.sheetLight,
          ]}
        >
          {/* Handle */}
          <View style={[styles.dragHandle, isDark && styles.dragHandleDark]} />

          {/* Badge */}
          <View style={[styles.iconBadge, isDark && styles.iconBadgeDark]}>
            <Funnel
              size={20}
              color={isDark ? '#4ADE80' : '#204E35'}
              weight="bold"
            />
          </View>

          {/* Title */}
          <Text style={[styles.sheetTitle, isDark && styles.sheetTitleDark]}>
            Filter
          </Text>

          {/* Subtitle */}
          <Text style={[styles.sheetSubtitle, isDark && styles.sheetSubtitleDark]}>
            Narrowing the list does not change the week on the home chart, which always shows everything.
          </Text>

          {/* Options Card */}
          <View style={[styles.optionsCard, isDark ? styles.optionsCardDark : styles.optionsCardLight]}>
            {/* Card row */}
            <Pressable onPress={cycleCard} style={styles.optionRow}>
              <Text style={[styles.optionLabel, isDark && styles.optionLabelDark]}>
                Card
              </Text>
              <View style={styles.rowRight}>
                <Text style={[styles.optionValue, isDark && styles.optionValueDark]} numberOfLines={1}>
                  {currentCardLabel}
                </Text>
                <CaretUpDown size={16} color={isDark ? '#8A9C91' : '#5C6A61'} />
              </View>
            </Pressable>

            <View style={[styles.divider, isDark && styles.dividerDark]} />

            {/* Category row */}
            <Pressable onPress={cycleCategory} style={styles.optionRow}>
              <Text style={[styles.optionLabel, isDark && styles.optionLabelDark]}>
                Category
              </Text>
              <View style={styles.rowRight}>
                <Text style={[styles.optionValue, isDark && styles.optionValueDark]}>
                  {currentCategoryLabel}
                </Text>
                <CaretUpDown size={16} color={isDark ? '#8A9C91' : '#5C6A61'} />
              </View>
            </Pressable>

            <View style={[styles.divider, isDark && styles.dividerDark]} />

            {/* Dates row */}
            <Pressable onPress={cycleDateRange} style={styles.optionRow}>
              <Text style={[styles.optionLabel, isDark && styles.optionLabelDark]}>
                Dates
              </Text>
              <View style={styles.rowRight}>
                <Text style={[styles.optionValue, isDark && styles.optionValueDark]}>
                  {currentDateLabel}
                </Text>
                <CaretUpDown size={16} color={isDark ? '#8A9C91' : '#5C6A61'} />
              </View>
            </Pressable>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonStack}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onApply();
              }}
              style={({ pressed }) => [
                styles.primaryBtn,
                isDark ? styles.primaryBtnDark : styles.primaryBtnLight,
                { opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text style={styles.primaryBtnText}>Show these</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClear();
              }}
              style={({ pressed }) => [
                styles.secondaryBtn,
                isDark ? styles.secondaryBtnDark : styles.secondaryBtnLight,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={[styles.secondaryBtnText, isDark && styles.secondaryBtnTextDark]}>
                Clear all
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  scrimBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,
  },
  sheetLight: {
    backgroundColor: '#FFFFFF',
  },
  sheetDark: {
    backgroundColor: '#16201B',
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DCDAD3',
    alignSelf: 'center',
    marginBottom: 16,
  },
  dragHandleDark: {
    backgroundColor: '#35463C',
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E2EDE6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBadgeDark: {
    backgroundColor: '#1E3527',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0E1A13',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  sheetTitleDark: {
    color: '#F2F7F4',
  },
  sheetSubtitle: {
    fontSize: 13.5,
    color: '#5C6A61',
    lineHeight: 18,
    marginBottom: 20,
  },
  sheetSubtitleDark: {
    color: '#8A9C91',
  },
  optionsCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  optionsCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECEAE4',
  },
  optionsCardDark: {
    backgroundColor: '#202B24',
    borderColor: '#2D3C33',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '65%',
  },
  optionLabel: {
    fontSize: 14.5,
    color: '#0E1A13',
    fontWeight: '600',
  },
  optionLabelDark: {
    color: '#F2F7F4',
  },
  optionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C6A61',
  },
  optionValueDark: {
    color: '#8A9C91',
  },
  divider: {
    height: 1,
    backgroundColor: '#ECEAE4',
  },
  dividerDark: {
    backgroundColor: '#2D3C33',
  },
  buttonStack: {
    gap: 12,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnLight: {
    backgroundColor: '#204E35',
  },
  primaryBtnDark: {
    backgroundColor: '#225B3C',
  },
  primaryBtnText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryBtnLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8D7D1',
  },
  secondaryBtnDark: {
    backgroundColor: '#202B24',
    borderColor: '#35463C',
  },
  secondaryBtnText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0E1A13',
  },
  secondaryBtnTextDark: {
    color: '#F2F7F4',
  },
});
