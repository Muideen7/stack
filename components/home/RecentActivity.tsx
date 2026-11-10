// components/home/RecentActivity.tsx
import { useColorScheme } from 'nativewind';
import { Coffee, Receipt, ShoppingBag, Train } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Transaction } from '../../types/models';
import { Money } from '../../utils/money';

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
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Recent activity
        </Text>
        {onViewAll && (
          <Pressable onPress={onViewAll}>
            <Text style={[styles.seeAll, isDark && styles.seeAllDark]}>
              See all
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.listContainer}>
        {transactions.slice(0, 4).map((tx) => {
          const IconComp = getIcon(tx.merchant, tx.category);
          const iconColor = isDark ? '#A2B5A8' : '#3E4E44';

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
                    isDark ? styles.iconBoxDark : styles.iconBoxLight,
                  ]}
                >
                  <IconComp size={20} color={iconColor} weight="bold" />
                </View>
                <View style={styles.metaCol}>
                  <Text
                    style={[styles.merchantText, isDark && styles.merchantTextDark]}
                    numberOfLines={1}
                  >
                    {tx.merchant}
                  </Text>
                  <Text style={[styles.categoryText, isDark && styles.categoryTextDark]}>
                    {tx.category} · •••• 8152
                  </Text>
                </View>
              </View>

              <Text style={[styles.amountText, isDark && styles.amountTextDark]}>
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
    color: '#0E1A13',
    letterSpacing: -0.2,
  },
  titleDark: {
    color: '#F2F7F4',
  },
  seeAll: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#204E35',
  },
  seeAllDark: {
    color: '#4ADE80',
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
  merchantText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0E1A13',
    marginBottom: 2,
  },
  merchantTextDark: {
    color: '#F2F7F4',
  },
  categoryText: {
    fontSize: 12.5,
    color: '#5C6A61',
  },
  categoryTextDark: {
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
});

