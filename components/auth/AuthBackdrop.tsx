// components/auth/AuthBackdrop.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Path,
  Defs,
  RadialGradient,
  Stop,
  Rect,
} from 'react-native-svg';
import { useColorScheme } from 'nativewind';
import { getTheme } from '../../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AuthBackdropProps {
  children?: React.ReactNode;
}

export const AuthBackdrop: React.FC<AuthBackdropProps> = ({ children }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  const w = SCREEN_WIDTH;
  const h = SCREEN_HEIGHT;

  // 7 subtle architectural contour wave lines
  const lines = [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const base = h * (0.24 + i * 0.095);
    const amp = h * 0.016 * (1 - i / 10);
    const strokeWidth = 1 + i * 0.2;
    const p1x = w * 0.25;
    const p1y = base + amp;
    const p2x = w * 0.75;
    const p2y = base - amp;
    const endX = w * 1.1;
    const endY = base + amp * 0.5;

    return {
      d: `M -20 ${base} C ${p1x} ${p1y}, ${p2x} ${p2y}, ${endX} ${endY}`,
      strokeWidth,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.ground }]}>
      <View style={StyleSheet.absoluteFill}>
        <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
          <Defs>
            {/* Soft architectural top bloom */}
            <RadialGradient
              id="topBloom"
              cx="25%"
              cy="20%"
              rx="60%"
              ry="45%"
              fx="25%"
              fy="20%"
            >
              <Stop offset="0%" stopColor={theme.accent} stopOpacity={isDark ? 0.06 : 0.04} />
              <Stop offset="60%" stopColor={theme.accent} stopOpacity={0.01} />
              <Stop offset="100%" stopColor={theme.ground} stopOpacity={0} />
            </RadialGradient>
          </Defs>

          {/* Crisp Ground */}
          <Rect x={0} y={0} width={w} height={h} fill={theme.ground} />

          {/* Bloom */}
          <Rect x={0} y={0} width={w} height={h} fill="url(#topBloom)" />

          {/* Architectural Lines */}
          {lines.map((l, idx) => (
            <Path
              key={idx}
              d={l.d}
              stroke={theme.ink}
              strokeWidth={l.strokeWidth}
              strokeOpacity={isDark ? 0.04 : 0.035}
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </Svg>
      </View>

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
