// components/navigation/FloatingTabBar.tsx
import * as Haptics from '@/utils/haptics';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'nativewind';
import { CreditCard, House, User } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getTheme } from '../../constants/theme';

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
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
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
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
