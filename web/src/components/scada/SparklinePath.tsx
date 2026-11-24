'use client';

import React from 'react';

export interface SparklineProps {
  points?: number[];
  height?: number;
  strokeColor?: string;
  fillColor?: string;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = React.memo(
  ({
    points = [12, 14, 13, 18, 16, 21, 24, 22, 28, 25, 29, 32],
    height = 36,
    strokeColor = '#38BDF8',
    fillColor = 'rgba(56, 189, 248, 0.12)',
    className = '',
  }) => {
    if (!points || points.length < 2) return null;

    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 180;
    const padding = 3;
    const usableH = height - padding * 2;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - padding - ((val - min) / range) * usableH;
      return [x, y];
    });

    const dPath = coords.reduce((acc, [x, y], idx) => {
      if (idx === 0) return `M ${x} ${y}`;
      const [prevX, prevY] = coords[idx - 1];
      const cx = (prevX + x) / 2;
      return `${acc} C ${cx} ${prevY}, ${cx} ${y}, ${x} ${y}`;
    }, '');

    const areaPath = `${dPath} L ${width} ${height} L 0 ${height} Z`;

    return (
      <div className={`w-full overflow-hidden ${className}`}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`spark-grad-${strokeColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d={areaPath}
            fill={`url(#spark-grad-${strokeColor.replace('#', '')})`}
          />
          <path
            d={dPath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: `drop-shadow(0 0 5px ${strokeColor})`,
            }}
          />
        </svg>
      </div>
    );
  }
);

Sparkline.displayName = 'Sparkline';
