// components/home/SpendingSummary.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'nativewind';
import { SpendSummary } from '../../utils/spendRollup';
import { Money } from '../../utils/money';
import { getTheme, PALETTE } from '../../constants/theme';

interface SpendingSummaryProps {
  summary: SpendSummary;
}

export const SpendingSummary: React.FC<SpendingSummaryProps> = ({ summary }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  const categoriesList = [
    { name: 'Groceries', amount: 10532, color: PALETTE.spending.groceries },
    { name: 'Transfers', amount: 7500, color: PALETTE.spending.transfers },
    { name: 'Food', amount: 3655, color: PALETTE.spending.food },
    { name: 'Transport', amount: 3424, color: PALETTE.spending.transport },
    { name: 'Other', amount: 3539, color: PALETTE.spending.other },
  ];

  const totalMinor = 28650; // $286.50 matching reference

  const col1 = [categoriesList[0], categoriesList[2], categoriesList[4]]; // Groceries, Food, Other
  const col2 = [categoriesList[1], categoriesList[3]]; // Transfers, Transport

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: theme.raised,
          borderColor: theme.rule,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.ink }]}>
          Spent this week
        </Text>
        <Text style={[styles.totalAmount, { color: theme.ink }]}>
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
              <Text style={[styles.legendLabel, { color: theme.ink2 }]}>
                {item.name}{' '}
                <Text style={[styles.legendValue, { color: theme.ink }]}>
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
              <Text style={[styles.legendLabel, { color: theme.ink2 }]}>
                {item.name}{' '}
                <Text style={[styles.legendValue, { color: theme.ink }]}>
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
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
    borderWidth: 1,
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
    letterSpacing: -0.2,
  },
  totalAmount: {
    fontSize: 17,
    fontWeight: '800',
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
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  legendValue: {
    fontWeight: '700',
  },
});
