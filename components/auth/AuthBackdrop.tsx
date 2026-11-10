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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AuthBackdropProps {
  children?: React.ReactNode;
}

export const AuthBackdrop: React.FC<AuthBackdropProps> = ({ children }) => {
  const w = SCREEN_WIDTH;
  const h = SCREEN_HEIGHT;

  // 7 sediment contour wave lines
  const lines = [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const base = h * (0.24 + i * 0.095);
    const amp = h * 0.016 * (1 - i / 10);
    const strokeWidth = 1 + i * 0.2;
    // Cubic bezier curve path
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
    <View style={styles.container}>
      {/* Background SVG with warm paper, soft radial blooms, and sediment contours */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
          <Defs>
            {/* Top-left soft green bloom */}
            <RadialGradient
              id="topBloom"
              cx="25%"
              cy="20%"
              rx="60%"
              ry="45%"
              fx="25%"
              fy="20%"
            >
              <Stop offset="0%" stopColor="#2D5A43" stopOpacity={0.09} />
              <Stop offset="60%" stopColor="#2D5A43" stopOpacity={0.03} />
              <Stop offset="100%" stopColor="#F4F3EF" stopOpacity={0} />
            </RadialGradient>

            {/* Bottom-right soft warm bloom */}
            <RadialGradient
              id="bottomBloom"
              cx="80%"
              cy="75%"
              rx="55%"
              ry="40%"
              fx="80%"
              fy="75%"
            >
              <Stop offset="0%" stopColor="#8C9B8E" stopOpacity={0.08} />
              <Stop offset="70%" stopColor="#8C9B8E" stopOpacity={0.02} />
              <Stop offset="100%" stopColor="#F4F3EF" stopOpacity={0} />
            </RadialGradient>
          </Defs>

          {/* Warm Paper Base */}
          <Rect x={0} y={0} width={w} height={h} fill="#F4F3EF" />

          {/* Blooms */}
          <Rect x={0} y={0} width={w} height={h} fill="url(#topBloom)" />
          <Rect x={0} y={0} width={w} height={h} fill="url(#bottomBloom)" />

          {/* Sediment Lines */}
          {lines.map((l, idx) => (
            <Path
              key={idx}
              d={l.d}
              stroke="#1C2D24"
              strokeWidth={l.strokeWidth}
              strokeOpacity={0.045}
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
    backgroundColor: '#F4F3EF',
  },
  content: {
    flex: 1,
  },
});
