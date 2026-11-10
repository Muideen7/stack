// components/home/QuickActions.tsx
import * as Haptics from '@/utils/haptics';
import { useColorScheme } from 'nativewind';
import { ArrowUpRight, ArrowsLeftRight, DotsThree, Plus } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface QuickActionsProps {
  onSend: () => void;
  onConvert: () => void;
  onAddCard: () => void;
  onMore: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onSend,
  onConvert,
  onAddCard,
  onMore,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const actions = [
    { label: 'Add', icon: Plus, action: onAddCard },
    { label: 'Send', icon: ArrowUpRight, action: onSend },
    { label: 'Convert', icon: ArrowsLeftRight, action: onConvert },
    { label: 'More', icon: DotsThree, action: onMore },
  ];

  const iconColor = isDark ? '#E5EDE7' : '#1C2E23';

  return (
    <View style={styles.container}>
      {actions.map((item) => {
        const IconComponent = item.icon;
        return (
          <Pressable
            key={item.label}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              item.action();
            }}
            style={({ pressed }) => [
              styles.actionItem,
              { opacity: pressed ? 0.75 : 1 },
            ]}
          >
            <View
              style={[
                styles.iconBox,
                isDark ? styles.iconBoxDark : styles.iconBoxLight,
              ]}
            >
              <IconComponent
                size={22}
                color={iconColor}
                weight={item.label === 'More' ? 'bold' : 'bold'}
              />
            </View>
            <Text
              style={[
                styles.actionLabel,
                { color: isDark ? '#95A69B' : '#4C5850' },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 68,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBoxLight: {
    backgroundColor: '#EBE9E2',
  },
  iconBoxDark: {
    backgroundColor: '#202B24',
  },
  actionLabel: {
    fontSize: 12.5,
    fontWeight: '600',
  },
});

