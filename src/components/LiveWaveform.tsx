import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  level: number; // 0 to 1
  active: boolean;
  bars?: number;
  color?: string;
  height?: number;
};

// Convert the recorder's decibel reading (about -60 quiet to 0 loud) to 0..1
export function dbToLevel(db: number | undefined | null): number {
  if (db === undefined || db === null || !Number.isFinite(db)) return 0;
  const clamped = Math.max(-60, Math.min(0, db));
  return Math.pow((clamped + 60) / 60, 1.6); // curve so speech visibly moves
}

export default function LiveWaveform({ level, active, bars = 36, color = '#c8334a', height = 64 }: Props) {
  const [history, setHistory] = useState<number[]>(() => Array(bars).fill(0));

  useEffect(() => {
    if (!active) {
      setHistory(Array(bars).fill(0));
      return;
    }
    setHistory((prev) => [...prev.slice(1), level]);
  }, [level, active, bars]);

  return (
    <View style={[styles.row, { height }]}>
      {history.map((v, i) => (
        <View
          key={i}
          style={{
            width: 3,
            marginHorizontal: 1.5,
            borderRadius: 2,
            backgroundColor: color,
            height: 4 + v * (height - 4),
            opacity: 0.45 + v * 0.55,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});