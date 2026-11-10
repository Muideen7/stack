// components/navigation/FloatingTabBar.tsx
import * as Haptics from '@/utils/haptics';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'nativewind';
import { CreditCard, House, User } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.floatingWrapper} pointerEvents="box-none">
      <View
        style={[
          styles.barContainer,
          isDark ? styles.barContainerDark : styles.barContainerLight,
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

          const iconColor = isFocused
            ? (isDark ? '#4ADE80' : '#204E35')
            : (isDark ? '#8A9B91' : '#4C5A51');

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabItem,
                isFocused && (isDark ? styles.tabItemActiveDark : styles.tabItemActiveLight),
              ]}
            >
              {route.name === 'index' && (
                <House size={22} color={iconColor} weight={isFocused ? 'fill' : 'regular'} />
              )}
              {route.name === 'cards' && (
                <CreditCard size={22} color={iconColor} weight={isFocused ? 'fill' : 'regular'} />
              )}
              {route.name === 'profile' && (
                <User size={22} color={iconColor} weight={isFocused ? 'fill' : 'regular'} />
              )}

              {isFocused && (
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isDark ? '#4ADE80' : '#204E35' },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    gap: 6,
  },
  barContainerLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEAE4',
  },
  barContainerDark: {
    backgroundColor: '#16201B',
    borderWidth: 1,
    borderColor: '#26352D',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 28,
  },
  tabItemActiveLight: {
    backgroundColor: '#E2EDE6',
  },
  tabItemActiveDark: {
    backgroundColor: '#1E3929',
  },
  tabLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    marginLeft: 8,
  },
});

