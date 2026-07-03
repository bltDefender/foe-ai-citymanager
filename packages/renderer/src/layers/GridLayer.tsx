import React from 'react';
import { Layer, Line } from 'react-konva';

interface GridLayerProps {
  readonly columns: number;
  readonly rows: number;
  readonly tileSize: number;
}

export function GridLayer({ columns, rows, tileSize }: GridLayerProps): React.ReactElement {
  const lines: React.ReactElement[] = [];
  const width = columns * tileSize;
  const height = rows * tileSize;

  for (let col = 0; col <= columns; col += 1) {
    const x = col * tileSize;
    lines.push(
      <Line
        key={`v-${col}`}
        points={[x, 0, x, height]}
        stroke="#2c2e33"
        strokeWidth={0.5}
        listening={false}
      />,
    );
  }

  for (let row = 0; row <= rows; row += 1) {
    const y = row * tileSize;
    lines.push(
      <Line
        key={`h-${row}`}
        points={[0, y, width, y]}
        stroke="#2c2e33"
        strokeWidth={0.5}
        listening={false}
      />,
    );
  }

  return <Layer listening={false}>{lines}</Layer>;
}
