// components/cards/WalletStack.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Plus } from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import { useRouter } from 'expo-router';
import * as Haptics from '@/utils/haptics';
import { PaymentCard } from '../../types/models';
import { CardFace } from './CardFace';
import { getTheme } from '../../constants/theme';

interface WalletStackProps {
  cards: PaymentCard[];
  selectedIndex: number;
  onSelectCard: (index: number) => void;
  onAddCard?: () => void;
}

export const WalletStack: React.FC<WalletStackProps> = ({
  cards,
  selectedIndex,
  onSelectCard,
  onAddCard,
}) => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  const handleAddCard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onAddCard) {
      onAddCard();
    } else {
      router.push('/add-card');
    }
  };

  return (
    <View style={styles.stackWrapper}>
      {/* Cascading Cards */}
      <View style={styles.cardsLayer}>
        {cards.map((card, idx) => {
          const offsetTop = idx === 0 ? 0 : -148;

          return (
            <Pressable
              key={card.id}
              onPress={() => {
                Haptics.selectionAsync();
                onSelectCard(idx);
              }}
              style={[
                styles.cardPressable,
                {
                  marginTop: offsetTop,
                  zIndex: idx + 1,
                },
              ]}
            >
              <CardFace card={card} showBalance={false} />
            </Pressable>
          );
        })}

        {/* 4th Item: Add a Card Dashed Slot */}
        <Pressable
          onPress={handleAddCard}
          style={[
            styles.addSlotCard,
            {
              backgroundColor: theme.raisedSubtle,
              borderColor: theme.rule,
              marginTop: -148,
              zIndex: cards.length + 1,
            },
          ]}
        >
          <View style={[styles.plusBadge, { backgroundColor: theme.raised, borderColor: theme.rule }]}>
            <Plus size={22} color={theme.ink} weight="bold" />
          </View>
          <Text style={[styles.addCardTitle, { color: theme.ink }]}>
            Add a card
          </Text>
          <Text style={[styles.addCardSubtitle, { color: theme.ink2 }]}>
            Debit or credit, detected as you type
          </Text>
        </Pressable>
      </View>

      {/* Footer Text under the wallet */}
      <View style={styles.footerSection}>
        <Text style={[styles.walletTitle, { color: theme.ink }]}>
          Your wallet
        </Text>
        <Text style={[styles.walletSubtitle, { color: theme.ink2 }]}>
          {cards.length} cards · tap one to open
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stackWrapper: {
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  cardsLayer: {
    width: '100%',
  },
  cardPressable: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  addSlotCard: {
    width: '100%',
    aspectRatio: 1.58,
    borderRadius: 22,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  plusBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  addCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  addCardSubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 28,
  },
  walletTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  walletSubtitle: {
    fontSize: 13.5,
  },
});
