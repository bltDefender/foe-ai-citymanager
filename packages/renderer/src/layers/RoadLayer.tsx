import React from 'react';
import { Layer, Rect } from 'react-konva';
import type { Road } from '@forgemind/core';
import type { ColorScheme } from '../types/index.js';
import { getColorForRoad } from '../colors/index.js';

interface RoadLayerProps {
  readonly roads: readonly Road[];
  readonly tileSize: number;
  readonly colorScheme: ColorScheme;
  readonly onHover?: (roadId: string | null) => void;
  readonly onClick?: (roadId: string) => void;
}

export function RoadLayer({ roads, tileSize, colorScheme, onHover, onClick }: RoadLayerProps): React.ReactElement {
  return (
    <Layer>
      {roads.map((road) => {
        const color = getColorForRoad(road, colorScheme);
        return (
          <Rect
            key={road.id}
            x={road.x * tileSize}
            y={road.y * tileSize}
            width={road.width * tileSize}
            height={road.height * tileSize}
            fill={color.fill}
            stroke={color.stroke}
            strokeWidth={0.5}
            onMouseEnter={() => onHover?.(road.id)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => onClick?.(road.id)}
          />
        );
      })}
    </Layer>
  );
}
