// components/common/AmountText.tsx
import React from 'react';
import { Text, View } from 'react-native';
import { Money } from '../../utils/money';

interface AmountTextProps {
  amountMinor: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  signed?: boolean;
  color?: string;
}

export const AmountText: React.FC<AmountTextProps> = ({
  amountMinor,
  currency = 'USD',
  size = 'md',
  signed = false,
  color,
}) => {
  const isPositive = amountMinor > 0;
  const isNegative = amountMinor < 0;

  const { major, minor } = Money.parts(amountMinor, currency);

  let signPrefix = '';
  if (signed) {
    if (isNegative) signPrefix = '-';
    else if (isPositive) signPrefix = '+';
  }

  const sizeClasses = {
    sm: { major: 'text-base font-semibold', minor: 'text-xs' },
    md: { major: 'text-xl font-bold', minor: 'text-sm' },
    lg: { major: 'text-3xl font-extrabold', minor: 'text-lg' },
    hero: { major: 'text-5xl font-extrabold tracking-tight', minor: 'text-2xl' },
  }[size];

  const defaultColor = signed
    ? isNegative
      ? 'text-ink-dark'
      : 'text-brand'
    : 'text-ink-dark';

  return (
    <View className="flex-row items-baseline">
      <Text
        className={`${sizeClasses.major} ${defaultColor}`}
        style={color ? { color } : undefined}
      >
        {signPrefix}{major}
      </Text>
      <Text
        className={`${sizeClasses.minor} opacity-60 ml-0.5 ${defaultColor}`}
        style={color ? { color } : undefined}
      >
        {minor}
      </Text>
    </View>
  );
};

