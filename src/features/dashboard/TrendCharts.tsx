import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Line, Rect, Text as SvgText } from 'react-native-svg';

const PAD_L = 38;
const PAD_R = 8;
const PAD_T = 8;
const PAD_B = 22;

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

type Props = { values: number[]; labels: string[]; width: number; height?: number };

function geometry(values: number[], width: number, height: number) {
  const max = niceMax(Math.max(0, ...values));
  const innerW = width - PAD_L - PAD_R;
  const innerH = height - PAD_T - PAD_B;
  const y = (v: number) => PAD_T + innerH - (v / max) * innerH;
  return { max, innerW, innerH, y, baseY: PAD_T + innerH };
}

export function SalesTrendChart({ values, labels, width, height = 130 }: Props) {
  const { max, innerW, y, baseY } = geometry(values, width, height);
  const x = (i: number) => PAD_L + (values.length > 1 ? (i * innerW) / (values.length - 1) : innerW / 2);

  const line = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${x(values.length - 1).toFixed(1)},${baseY} L${x(0).toFixed(1)},${baseY} Z`;
  const ticks = [0, 0.5, 1].map((t) => t * max);

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#10b981" stopOpacity="0.28" />
          <Stop offset="1" stopColor="#10b981" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      {ticks.map((t) => (
        <React.Fragment key={t}>
          <Line x1={PAD_L} x2={width - PAD_R} y1={y(t)} y2={y(t)} stroke="#e5e7eb" strokeDasharray="3 4" />
          <SvgText x={PAD_L - 6} y={y(t) + 3} fontSize={9} fill="#6b7280" textAnchor="end">{short(t)}</SvgText>
        </React.Fragment>
      ))}
      <Path d={area} fill="url(#salesFill)" />
      <Path d={line} stroke="#10b981" strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => (
        <Circle key={i} cx={x(i)} cy={y(v)} r={3.2} fill="#ffffff" stroke="#10b981" strokeWidth={2} />
      ))}
      {labels.map((l, i) => (
        <SvgText key={l + i} x={x(i)} y={height - 6} fontSize={10} fill="#374151" textAnchor="middle">{l}</SvgText>
      ))}
    </Svg>
  );
}

export function ExpenseBarChart({ values, labels, width, height = 130 }: Props) {
  const { max, innerW, y, baseY } = geometry(values, width, height);
  const slot = innerW / Math.max(values.length, 1);
  const barW = Math.min(18, slot * 0.5);
  const ticks = [0, 0.5, 1].map((t) => t * max);

  return (
    <Svg width={width} height={height}>
      {ticks.map((t) => (
        <React.Fragment key={t}>
          <Line x1={PAD_L} x2={width - PAD_R} y1={y(t)} y2={y(t)} stroke="#e5e7eb" strokeDasharray="3 4" />
          <SvgText x={PAD_L - 6} y={y(t) + 3} fontSize={9} fill="#6b7280" textAnchor="end">{short(t)}</SvgText>
        </React.Fragment>
      ))}
      {values.map((v, i) => {
        const cx = PAD_L + slot * i + slot / 2;
        const top = y(v);
        return (
          <Rect
            key={i}
            x={cx - barW / 2}
            y={top}
            width={barW}
            height={Math.max(baseY - top, v > 0 ? 2 : 0)}
            rx={3}
            fill="#e0a02a"
          />
        );
      })}
      {labels.map((l, i) => (
        <SvgText key={l + i} x={PAD_L + slot * i + slot / 2} y={height - 6} fontSize={10} fill="#374151" textAnchor="middle">{l}</SvgText>
      ))}
    </Svg>
  );
}