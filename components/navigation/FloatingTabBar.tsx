// components/navigation/FloatingTabBar.tsx
import * as Haptics from '@/utils/haptics';
import { useColorScheme } from 'nativewind';
import { CreditCard, House, User } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getTheme } from '../../constants/theme';

export interface FloatingTabBarProps {
  state: {
    index: number;
    routes: Array<{ key: string; name: string; params?: any }>;
  };
  descriptors: Record<string, { options: { title?: string } }>;
  navigation?: {
    emit: (event: any) => any;
    navigate: (name: string) => void;
  };
  emitter?: {
    emit: (event: any) => any;
  };
  navigateToTab?: (routeKey: string) => void;
}

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
  emitter,
  navigateToTab,
}: FloatingTabBarProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  return (
    <View style={styles.floatingWrapper} pointerEvents="box-none">
      <View
        style={[
          styles.barContainer,
          {
            backgroundColor: theme.navBackground,
            borderColor: theme.navBorder,
          },
        ]}
      >
        {state.routes.map((route: { key: string; name: string }, index: number) => {
          const isFocused = state.index === index;
          const descriptor = descriptors[route.key];
          const options = descriptor?.options || {};

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const event = navigation
              ? navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                })
              : emitter
              ? emitter.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                })
              : { defaultPrevented: false };

            if (!isFocused && !event?.defaultPrevented) {
              if (navigateToTab) {
                navigateToTab(route.key);
              } else if (navigation) {
                navigation.navigate(route.name);
              }
            }
          };

          const iconColor = isFocused ? theme.accent : theme.ink2;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabItem,
                isFocused && { backgroundColor: theme.accentSoft },
              ]}
            >
              {route.name === 'index' && (
                <House size={22} color={iconColor} weight={isFocused ? 'fill' : 'bold'} />
              )}
              {route.name === 'cards' && (
                <CreditCard size={22} color={iconColor} weight={isFocused ? 'fill' : 'bold'} />
              )}
              {route.name === 'profile' && (
                <User size={22} color={iconColor} weight={isFocused ? 'fill' : 'bold'} />
              )}

              {isFocused && (
                <Text
                  style={[
                    styles.tabLabel,
                    { color: theme.accent },
                  ]}
                >
                  {options.title ?? route.name}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 36,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 8,
    gap: 6,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
  },
  tabLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: -0.2,
  },
});
