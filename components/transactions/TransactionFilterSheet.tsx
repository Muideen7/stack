// components/transactions/TransactionFilterSheet.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Funnel, CaretUpDown } from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';
import { SpendCategory } from '../../types/models';
import { getTheme } from '../../constants/theme';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedCard: string;
  onChangeCard: (card: string) => void;
  selectedCategory: SpendCategory | 'All';
  onChangeCategory: (cat: SpendCategory | 'All') => void;
  selectedDateRange: string;
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
  const theme = getTheme(isDark);

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
        <Pressable style={styles.scrimBackdrop} onPress={onClose} />

        <SafeAreaView
          edges={['bottom']}
          style={[
            styles.sheetContainer,
            {
              backgroundColor: theme.raised,
            },
          ]}
        >
          {/* Drag Handle */}
          <View style={[styles.dragHandle, { backgroundColor: theme.rule }]} />

          {/* Icon Badge */}
          <View style={[styles.iconBadge, { backgroundColor: theme.accentSoft }]}>
            <Funnel
              size={20}
              color={theme.accent}
              weight="bold"
            />
          </View>

          {/* Title */}
          <Text style={[styles.sheetTitle, { color: theme.ink }]}>
            Filter
          </Text>

          {/* Subtitle */}
          <Text style={[styles.sheetSubtitle, { color: theme.ink2 }]}>
            Narrowing the list does not change the week on the home chart, which always shows everything.
          </Text>

          {/* Options Card */}
          <View
            style={[
              styles.optionsCard,
              {
                backgroundColor: theme.raisedSubtle,
                borderColor: theme.rule,
              },
            ]}
          >
            {/* Card row */}
            <Pressable onPress={cycleCard} style={styles.optionRow}>
              <Text style={[styles.optionLabel, { color: theme.ink }]}>
                Card
              </Text>
              <View style={styles.rowRight}>
                <Text style={[styles.optionValue, { color: theme.ink2 }]} numberOfLines={1}>
                  {currentCardLabel}
                </Text>
                <CaretUpDown size={16} color={theme.ink2} />
              </View>
            </Pressable>

            <View style={[styles.divider, { backgroundColor: theme.rule }]} />

            {/* Category row */}
            <Pressable onPress={cycleCategory} style={styles.optionRow}>
              <Text style={[styles.optionLabel, { color: theme.ink }]}>
                Category
              </Text>
              <View style={styles.rowRight}>
                <Text style={[styles.optionValue, { color: theme.ink2 }]}>
                  {currentCategoryLabel}
                </Text>
                <CaretUpDown size={16} color={theme.ink2} />
              </View>
            </Pressable>

            <View style={[styles.divider, { backgroundColor: theme.rule }]} />

            {/* Date range row */}
            <Pressable onPress={cycleDateRange} style={styles.optionRow}>
              <Text style={[styles.optionLabel, { color: theme.ink }]}>
                Dates
              </Text>
              <View style={styles.rowRight}>
                <Text style={[styles.optionValue, { color: theme.ink2 }]}>
                  {currentDateLabel}
                </Text>
                <CaretUpDown size={16} color={theme.ink2} />
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
                {
                  backgroundColor: theme.accent,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              <Text style={[styles.primaryBtnText, { color: theme.onAccent }]}>Show these</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClear();
              }}
              style={({ pressed }) => [
                styles.secondaryBtn,
                {
                  backgroundColor: theme.raised,
                  borderColor: theme.rule,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={[styles.secondaryBtnText, { color: theme.ink }]}>
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
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  sheetSubtitle: {
    fontSize: 13.5,
    lineHeight: 18,
    marginBottom: 20,
  },
  optionsCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 20,
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
    fontWeight: '600',
  },
  optionValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
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
  primaryBtnText: {
    fontSize: 15.5,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 15.5,
    fontWeight: '700',
  },
});
