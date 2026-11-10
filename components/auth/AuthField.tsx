// components/auth/AuthField.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TextInputProps } from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import { getTheme } from '../../constants/theme';

interface AuthFieldProps extends TextInputProps {
  label: string;
  leadingIcon?: React.ReactNode;
  isPassword?: boolean;
  trailingRightAction?: React.ReactNode;
}

export const AuthField: React.FC<AuthFieldProps> = ({
  label,
  leadingIcon,
  isPassword = false,
  trailingRightAction,
  ...inputProps
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.group}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: theme.ink }]}>{label}</Text>
        {trailingRightAction}
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.raised,
            borderColor: theme.rule,
          },
        ]}
      >
        {leadingIcon && <View style={styles.leadingIcon}>{leadingIcon}</View>}

        <TextInput
          style={[styles.input, { color: theme.ink }]}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor={theme.ink3}
          {...inputProps}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={8}
            style={styles.eyeButton}
          >
            {showPassword ? (
              <EyeSlash size={19} color={theme.ink2} />
            ) : (
              <Eye size={19} color={theme.ink2} />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    gap: 7,
    marginVertical: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  leadingIcon: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  eyeButton: {
    padding: 4,
    marginLeft: 6,
  },
});
