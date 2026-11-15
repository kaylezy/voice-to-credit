import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Line, Circle } from 'react-native-svg';

export type ActivityPoint = { label: string; sales: number; costs: number };

const H = 160;
const PAD_L = 44;
const PAD_R = 12;
const PAD_T = 10;
const PAD_B = 8;

function short(n: number): string {
  if (n >= 1_000_000) return `₦${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${+(n / 1_000).toFixed(0)}k`;
  return `₦${Math.round(n)}`;
}

function niceMax(v: number): number {
  if (v <= 0) return 1000;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

export default function ActivityChart({ data, width }: { data: ActivityPoint[]; width: number }) {
  const max = niceMax(Math.max(0, ...data.flatMap((d) => [d.sales, d.costs])));
  const innerW = width - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

  const x = (i: number) => PAD_L + (data.length > 1 ? i * stepX : innerW / 2);
  const y = (v: number) => PAD_T + innerH - (v / max) * innerH;

  const path = (key: 'sales' | 'costs') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(' ');

  const ticks = [0, 0.5, 1].map((t) => t * max);

  return (
    <View>
      <Svg width={width} height={H}>
        {ticks.map((t) => (
          <React.Fragment key={t}>
            <Line x1={PAD_L} x2={width - PAD_R} y1={y(t)} y2={y(t)} stroke="#e5e7eb" strokeDasharray="4 4" />
          </React.Fragment>
        ))}
        <Path d={path('sales')} stroke="#14b8a6" strokeWidth={3} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <Path d={path('costs')} stroke="#f59e0b" strokeWidth={3} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => (
          <React.Fragment key={d.label + i}>
            <Circle cx={x(i)} cy={y(d.sales)} r={3.5} fill="#14b8a6" />
            <Circle cx={x(i)} cy={y(d.costs)} r={3.5} fill="#f59e0b" />
          </React.Fragment>
        ))}
      </Svg>

      {/* Y labels */}
      {ticks.map((t) => (
        <Text key={t} style={[styles.yLabel, { top: y(t) - 7 }]}>{short(t)}</Text>
      ))}

      {/* X labels */}
      <View style={[styles.xRow, { paddingLeft: PAD_L - 14, paddingRight: PAD_R - 14 }]}>
        {data.map((d, i) => (
          <Text key={d.label + i} style={styles.xLabel}>{d.label}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  yLabel: { position: 'absolute', left: 0, width: PAD_L - 6, textAlign: 'right', fontSize: 10, color: '#6b7280' },
  xRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  xLabel: { fontSize: 11, color: '#6b7280', width: 28, textAlign: 'center' },
});