// components/common/PinKeypad.tsx
import * as Haptics from '@/utils/haptics';
import { Backspace } from 'phosphor-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface PinKeypadProps {
  onDigit: (digit: string) => void;
  onDelete: () => void;
  maxLength?: number;
  currentLength?: number;
}

export const PinKeypad: React.FC<PinKeypadProps> = ({
  onDigit,
  onDelete,
  maxLength = 4,
  currentLength = 0,
}) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];

  const handlePress = (key: string) => {
    if (key === 'delete') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onDelete();
    } else if (key !== '') {
      if (currentLength < maxLength) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onDigit(key);
      }
    }
  };

  return (
    <View className="w-full max-w-[280px] self-center">
      {/* PIN dot indicator */}
      <View className="flex-row justify-center space-x-4 mb-8">
        {Array.from({ length: maxLength }).map((_, i) => (
          <View
            key={i}
            className={`w-3.5 h-3.5 rounded-full mx-2 ${
              i < currentLength
                ? 'bg-brand'
                : 'bg-surface-subtleDark border border-white/10'
            }`}
          />
        ))}
      </View>

      {/* Keypad Grid */}
      <View className="flex-row flex-wrap justify-between">
        {keys.map((k, index) => {
          if (k === '') {
            return <View key={index} className="w-[80px] h-[72px]" />;
          }

          if (k === 'delete') {
            return (
              <Pressable
                key={index}
                onPress={() => handlePress('delete')}
                className="w-[80px] h-[72px] items-center justify-center active:opacity-60"
              >
                <Backspace size={24} color="#94A3B8" />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={index}
              onPress={() => handlePress(k)}
              className="w-[80px] h-[72px] items-center justify-center active:bg-surface-subtleDark rounded-full"
            >
              <Text className="text-2xl font-semibold text-ink-dark">{k}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

