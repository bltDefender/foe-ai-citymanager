import React from 'react';
import { Layer, Rect } from 'react-konva';
import type { HeatmapCell } from '@forgemind/core';

interface HeatmapLayerProps {
  readonly cells: readonly HeatmapCell[];
  readonly tileSize: number;
  readonly opacity: number;
  readonly visible: boolean;
}

function interpolateColor(value: number): string {
  const r = value < 0.5 ? Math.round(value * 2 * 255) : 255;
  const g = value < 0.5 ? Math.round(value * 2 * 255) : Math.round((1 - value) * 2 * 255);
  const b = value < 0.5 ? 255 : 0;
  return `rgb(${r},${g},${b})`;
}

export function HeatmapLayer({ cells, tileSize, opacity, visible }: HeatmapLayerProps): React.ReactElement {
  if (!visible) {
    return <Layer />;
  }

  return (
    <Layer listening={false}>
      {cells.map((cell, idx) => (
        <Rect
          key={`hm-${cell.x}-${cell.y}-${idx}`}
          x={cell.x * tileSize}
          y={cell.y * tileSize}
          width={tileSize}
          height={tileSize}
          fill={interpolateColor(Math.max(0, Math.min(1, cell.value)))}
          opacity={opacity}
        />
      ))}
    </Layer>
  );
}
