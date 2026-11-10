// components/home/QuickActions.tsx
import * as Haptics from '@/utils/haptics';
import { useColorScheme } from 'nativewind';
import { ArrowUpRight, ArrowsLeftRight, DotsThree, Plus } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getTheme } from '../../constants/theme';

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
  const theme = getTheme(isDark);

  const actions = [
    { label: 'Add', icon: Plus, action: onAddCard },
    { label: 'Send', icon: ArrowUpRight, action: onSend },
    { label: 'Convert', icon: ArrowsLeftRight, action: onConvert },
    { label: 'More', icon: DotsThree, action: onMore },
  ];

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
                {
                  backgroundColor: theme.raisedSubtle,
                  borderColor: theme.rule,
                },
              ]}
            >
              <IconComponent
                size={22}
                color={theme.ink}
                weight="bold"
              />
            </View>
            <Text
              style={[
                styles.actionLabel,
                { color: theme.ink2 },
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
    marginVertical: 14,
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
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
