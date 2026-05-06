import React from 'react';
import { View } from 'react-native';

export interface DotPosition {
  size: number;
  opacity: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

interface BackgroundDotsProps {
  positions: DotPosition[];
  color?: string;
}

export function BackgroundDots({ positions, color = '#E8A020' }: BackgroundDotsProps) {
  return (
    <>
      {positions.map((p, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            opacity: p.opacity,
            backgroundColor: color,
            top: p.top,
            left: p.left,
            right: p.right,
            bottom: p.bottom,
          }}
        />
      ))}
    </>
  );
}
