// components/common/StackMark.tsx
import React from 'react';
import Svg, { Rect } from 'react-native-svg';

interface StackMarkProps {
  size?: number; // width, default 28
  color?: string; // default #204E35
  reveals?: [number, number, number]; // 0..1 for each layer
}

/**
 * Stack's official project brand mark:
 * 3 stepping rounded horizontal slabs:
 *  1. Rect(x=0, y=0, w=22, h=4.5, rx=2) @ 100% opacity
 *  2. Rect(x=3, y=7.5, w=22, h=4.5, rx=2) @ 75% opacity
 *  3. Rect(x=6, y=15, w=22, h=4.5, rx=2) @ 50% opacity
 */
export const StackMark: React.FC<StackMarkProps> = ({
  size = 28,
  color = '#204E35',
  reveals = [1, 1, 1],
}) => {
  const w = size;
  const h = (size / 28) * 20;

  return (
    <Svg width={w} height={h} viewBox="0 0 28 20" fill="none">
      {reveals[0] > 0 && (
        <Rect
          x="0"
          y="0"
          width="22"
          height="4.5"
          rx="2"
          fill={color}
          fillOpacity={reveals[0] * 1.0}
        />
      )}
      {reveals[1] > 0 && (
        <Rect
          x="3"
          y="7.5"
          width="22"
          height="4.5"
          rx="2"
          fill={color}
          fillOpacity={reveals[1] * 0.75}
        />
      )}
      {reveals[2] > 0 && (
        <Rect
          x="6"
          y="15"
          width="22"
          height="4.5"
          rx="2"
          fill={color}
          fillOpacity={reveals[2] * 0.50}
        />
      )}
    </Svg>
  );
};
