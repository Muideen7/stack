// components/auth/AuthField.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TextInputProps } from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';

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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.group}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {trailingRightAction}
      </View>

      <View style={styles.inputContainer}>
        {leadingIcon && <View style={styles.leadingIcon}>{leadingIcon}</View>}

        <TextInput
          style={styles.input}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor="#9AA39D"
          {...inputProps}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={8}
            style={styles.eyeButton}
          >
            {showPassword ? (
              <EyeSlash size={19} color="#6B7770" />
            ) : (
              <Eye size={19} color="#6B7770" />
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
    color: '#1A241E',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8D7D1',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
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
    color: '#0E1A13',
    height: '100%',
  },
  eyeButton: {
    padding: 4,
    marginLeft: 6,
  },
});
