// components/cards/CardCarousel.tsx
import React from 'react';
import { Dimensions, View, NativeSyntheticEvent, NativeScrollEvent, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';
import { PaymentCard } from '../../types/models';
import { CardFace } from './CardFace';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.84;
const CARD_MARGIN = 14;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;
const HORIZONTAL_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

interface CardCarouselProps {
  cards: PaymentCard[];
  activeIndex: number;
  onFocusChange: (index: number) => void;
}

export const CardCarousel: React.FC<CardCarouselProps> = ({
  cards,
  activeIndex,
  onFocusChange,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SNAP_INTERVAL);
    if (index >= 0 && index < cards.length && index !== activeIndex) {
      Haptics.selectionAsync();
      onFocusChange(index);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: HORIZONTAL_PADDING }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {cards.map((card, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const cardOffset = index * SNAP_INTERVAL;
            const diff = (scrollX.value - cardOffset) / SNAP_INTERVAL;

            const scale = interpolate(
              diff,
              [-1, 0, 1],
              [0.93, 1, 0.93],
              Extrapolation.CLAMP
            );

            const opacity = interpolate(
              diff,
              [-1, 0, 1],
              [0.7, 1, 0.7],
              Extrapolation.CLAMP
            );

            return {
              transform: [{ scale }],
              opacity,
            };
          });

          return (
            <Animated.View
              key={card.id}
              style={[
                {
                  width: CARD_WIDTH,
                  marginRight: index < cards.length - 1 ? CARD_MARGIN : 0,
                },
                animatedStyle,
              ]}
            >
              <CardFace card={card} showBalance={false} />
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      {/* Pagination dots matching reference */}
      <View style={styles.dotsRow}>
        {cards.map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <View
              key={i}
              style={[
                styles.dot,
                isActive ? styles.dotActive : styles.dotInactive,
                isActive && isDark && styles.dotActiveDark,
                !isActive && isDark && styles.dotInactiveDark,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
    marginBottom: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 20,
    backgroundColor: '#204E35',
  },
  dotActiveDark: {
    backgroundColor: '#4ADE80',
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#D2D0C7',
  },
  dotInactiveDark: {
    backgroundColor: '#384A3F',
  },
});

