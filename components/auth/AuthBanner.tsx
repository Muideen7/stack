// components/auth/AuthBanner.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Info } from 'phosphor-react-native';

interface AuthBannerProps {
  message: string;
  onPress?: () => void;
}

export const AuthBanner: React.FC<AuthBannerProps> = ({ message, onPress }) => {
  const content = (
    <View style={styles.banner}>
      <Info size={16} color="#1E4331" weight="bold" />
      <Text style={styles.text}>{message}</Text>
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
    backgroundColor: '#E2EDE6',
    borderWidth: 1,
    borderColor: '#C8D9CE',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
    marginVertical: 12,
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: '#1E4331',
    lineHeight: 18,
    fontWeight: '500',
  },
});
