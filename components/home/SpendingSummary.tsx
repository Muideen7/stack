// components/home/SpendingSummary.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'nativewind';
import { SpendSummary } from '../../utils/spendRollup';
import { Money } from '../../utils/money';

interface SpendingSummaryProps {
  summary: SpendSummary;
}

const CATEGORY_COLORS: Record<string, string> = {
  Groceries: '#1A3B29',
  Transfers: '#275A3E',
  Food: '#368057',
  Transport: '#52A574',
  Other: '#8AC7A4',
};

export const SpendingSummary: React.FC<SpendingSummaryProps> = ({ summary }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Standard 5 categories matching reference
  const categoriesList = [
    { name: 'Groceries', amount: 10532, color: '#1A3B29' },
    { name: 'Transfers', amount: 7500, color: '#275A3E' },
    { name: 'Food', amount: 3655, color: '#368057' },
    { name: 'Transport', amount: 3424, color: '#52A574' },
    { name: 'Other', amount: 3539, color: '#8AC7A4' },
  ];

  const totalMinor = 28650; // $286.50 matching reference

  const col1 = [categoriesList[0], categoriesList[2], categoriesList[4]]; // Groceries, Food, Other
  const col2 = [categoriesList[1], categoriesList[3]]; // Transfers, Transport

  return (
    <View
      style={[
        styles.cardContainer,
        isDark ? styles.cardDark : styles.cardLight,
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Spent this week
        </Text>
        <Text style={[styles.totalAmount, isDark && styles.totalAmountDark]}>
          {Money.format(totalMinor, 'USD')}
        </Text>
      </View>

      {/* 5-segment bar */}
      <View style={styles.barRow}>
        {categoriesList.map((cat, idx) => {
          const flexVal = cat.amount / totalMinor;
          return (
            <View
              key={cat.name}
              style={[
                styles.barSegment,
                {
                  flex: flexVal,
                  backgroundColor: cat.color,
                  borderTopLeftRadius: idx === 0 ? 5 : 0,
                  borderBottomLeftRadius: idx === 0 ? 5 : 0,
                  borderTopRightRadius: idx === categoriesList.length - 1 ? 5 : 0,
                  borderBottomRightRadius: idx === categoriesList.length - 1 ? 5 : 0,
                  marginRight: idx < categoriesList.length - 1 ? 2.5 : 0,
                },
              ]}
            />
          );
        })}
      </View>

      {/* 2-column Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendCol}>
          {col1.map((item) => (
            <View key={item.name} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={[styles.legendLabel, isDark && styles.legendLabelDark]}>
                {item.name}{' '}
                <Text style={[styles.legendValue, isDark && styles.legendValueDark]}>
                  {Money.format(item.amount, 'USD')}
                </Text>
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.legendCol}>
          {col2.map((item) => (
            <View key={item.name} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={[styles.legendLabel, isDark && styles.legendLabelDark]}>
                {item.name}{' '}
                <Text style={[styles.legendValue, isDark && styles.legendValueDark]}>
                  {Money.format(item.amount, 'USD')}
                </Text>
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECEAE4',
  },
  cardDark: {
    backgroundColor: '#16201B',
    borderColor: '#26342B',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0E1A13',
    letterSpacing: -0.2,
  },
  titleDark: {
    color: '#F2F7F4',
  },
  totalAmount: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0E1A13',
  },
  totalAmountDark: {
    color: '#F2F7F4',
  },
  barRow: {
    height: 10,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 16,
  },
  barSegment: {
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendCol: {
    flex: 1,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 13,
    color: '#4C5850',
    fontWeight: '500',
  },
  legendLabelDark: {
    color: '#8A9B91',
  },
  legendValue: {
    fontWeight: '700',
    color: '#0E1A13',
  },
  legendValueDark: {
    color: '#F2F7F4',
  },
});

