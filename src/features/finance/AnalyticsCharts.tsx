import React from 'react';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';

const PAD_L = 40;
const PAD_R = 8;
const PAD_T = 16;
const PAD_B = 22;

export function shortNaira(n: number): string {
  if (n >= 1_000_000) return `₦${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${+(n / 1_000).toFixed(0)}k`;
  return `₦${Math.round(n)}`;
}

function niceMax(v: number): number {
  if (v <= 0) return 10;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

type GroupedProps = {
  labels: string[];
  a: number[];
  b: number[];
  width: number;
  height?: number;
  colorA?: string;
  colorB?: string;
};

export function GroupedBars({ labels, a, b, width, height = 150, colorA = '#1d7bf0', colorB = '#f97316' }: GroupedProps) {
  const max = niceMax(Math.max(0, ...a, ...b));
  const innerW = width - PAD_L - PAD_R;
  const innerH = height - PAD_T - PAD_B;
  const y = (v: number) => PAD_T + innerH - (v / max) * innerH;
  const baseY = PAD_T + innerH;
  const slot = innerW / Math.max(labels.length, 1);
  const barW = Math.min(14, slot * 0.28);
  const ticks = [0, 0.5, 1].map((t) => t * max);

  return (
    <Svg width={width} height={height}>
      {ticks.map((t) => (
        <React.Fragment key={t}>
          <Line x1={PAD_L} x2={width - PAD_R} y1={y(t)} y2={y(t)} stroke="#e5e7eb" strokeDasharray="3 4" />
          <SvgText x={PAD_L - 6} y={y(t) + 3} fontSize={9} fill="#6b7280" textAnchor="end">{shortNaira(t)}</SvgText>
        </React.Fragment>
      ))}
      {labels.map((l, i) => {
        const cx = PAD_L + slot * i + slot / 2;
        const ha = Math.max(baseY - y(a[i]), a[i] > 0 ? 2 : 0);
        const hb = Math.max(baseY - y(b[i]), b[i] > 0 ? 2 : 0);
        return (
          <React.Fragment key={l + i}>
            <Rect x={cx - barW - 1} y={baseY - ha} width={barW} height={ha} rx={3} fill={colorA} />
            <Rect x={cx + 1} y={baseY - hb} width={barW} height={hb} rx={3} fill={colorB} />
            <SvgText x={cx} y={height - 6} fontSize={10} fill="#374151" textAnchor="middle">{l}</SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

type TypeBarsProps = {
  labels: string[];
  values: number[];
  colors: string[];
  width: number;
  height?: number;
  format: (n: number) => string;
};

export function TypeBars({ labels, values, colors, width, height = 140, format }: TypeBarsProps) {
  const max = niceMax(Math.max(0, ...values));
  const innerH = height - PAD_T - PAD_B;
  const baseY = PAD_T + innerH;
  const slot = (width - 16) / Math.max(labels.length, 1);
  const barW = Math.min(34, slot * 0.55);

  return (
    <Svg width={width} height={height}>
      <Line x1={8} x2={width - 8} y1={baseY} y2={baseY} stroke="#e5e7eb" />
      {labels.map((l, i) => {
        const cx = 8 + slot * i + slot / 2;
        const h = Math.max((values[i] / max) * innerH, values[i] > 0 ? 2 : 0);
        return (
          <React.Fragment key={l}>
            <Rect x={cx - barW / 2} y={baseY - h} width={barW} height={h} rx={4} fill={colors[i]} />
            <SvgText x={cx} y={baseY - h - 4} fontSize={9} fontWeight="700" fill="#374151" textAnchor="middle">
              {format(values[i])}
            </SvgText>
            <SvgText x={cx} y={height - 6} fontSize={10} fill="#374151" textAnchor="middle">{l}</SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}