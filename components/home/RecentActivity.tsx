// components/home/RecentActivity.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Train, Coffee, ShoppingBag, Receipt } from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import { Transaction } from '../../types/models';
import { Money } from '../../utils/money';
import { getTheme } from '../../constants/theme';

interface RecentActivityProps {
  transactions: Transaction[];
  onViewAll?: () => void;
  onSelectTransaction?: (tx: Transaction) => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  transactions,
  onViewAll,
  onSelectTransaction,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

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
    return Receipt;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.ink }]}>
          Recent activity
        </Text>
        {onViewAll && (
          <Pressable onPress={onViewAll}>
            <Text style={[styles.seeAll, { color: theme.accent }]}>
              See all
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.listContainer}>
        {transactions.slice(0, 4).map((tx) => {
          const IconComp = getIcon(tx.merchant, tx.category);

          return (
            <Pressable
              key={tx.id}
              onPress={() => onSelectTransaction?.(tx)}
              style={({ pressed }) => [
                styles.itemRow,
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
                  <IconComp size={20} color={theme.ink} weight="bold" />
                </View>
                <View style={styles.metaCol}>
                  <Text
                    style={[styles.merchantText, { color: theme.ink }]}
                    numberOfLines={1}
                  >
                    {tx.merchant}
                  </Text>
                  <Text style={[styles.categoryText, { color: theme.ink2 }]}>
                    {tx.category} · •••• 8152
                  </Text>
                </View>
              </View>

              <Text style={[styles.amountText, { color: theme.ink }]}>
                {Money.signed(tx.amountMinor, tx.currency)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  seeAll: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  listContainer: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
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
  merchantText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 12.5,
  },
  amountText: {
    fontSize: 15.5,
    fontWeight: '800',
  },
});
