// components/auth/AuthBanner.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Info } from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import { getTheme } from '../../constants/theme';

interface AuthBannerProps {
  message: string;
  onPress?: () => void;
}

export const AuthBanner: React.FC<AuthBannerProps> = ({ message, onPress }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  const content = (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.accentSoft,
          borderColor: theme.rule,
        },
      ]}
    >
      <Info size={16} color={theme.accent} weight="bold" />
      <Text style={[styles.text, { color: theme.ink }]}>{message}</Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
    marginVertical: 12,
  },
  text: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
});
