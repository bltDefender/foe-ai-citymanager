import React from 'react';
import { Group, Layer, Rect, Text } from 'react-konva';
import type { Building, BuildingId } from '@forgemind/core';
import type { ColorScheme } from '../types/index.js';
import { getColorForBuilding } from '../colors/index.js';

interface BuildingLayerProps {
  readonly buildings: readonly Building[];
  readonly tileSize: number;
  readonly colorScheme: ColorScheme;
  readonly selectedIds: Set<BuildingId>;
  readonly hoveredId: BuildingId | null;
  readonly onSelect?: (buildingId: BuildingId, multi: boolean) => void;
  readonly onHover?: (buildingId: BuildingId | null) => void;
  readonly onContextMenu?: (buildingId: BuildingId, x: number, y: number) => void;
}

export function BuildingLayer({
  buildings,
  tileSize,
  colorScheme,
  selectedIds,
  hoveredId,
  onSelect,
  onHover,
  onContextMenu,
}: BuildingLayerProps): React.ReactElement {
  return (
    <Layer>
      {buildings.map((building) => {
        const color = getColorForBuilding(building, colorScheme);
        const isSelected = selectedIds.has(building.id);
        const isHovered = hoveredId === building.id;
        const px = building.x * tileSize;
        const py = building.y * tileSize;
        const pw = building.width * tileSize;
        const ph = building.height * tileSize;
        const showLabel = pw >= tileSize * 1.5 && ph >= tileSize;

        return (
          <Group
            key={building.id}
            onClick={(e) => {
              const evt = e.evt as MouseEvent;
              onSelect?.(building.id, evt.shiftKey);
            }}
            onMouseEnter={() => onHover?.(building.id)}
            onMouseLeave={() => onHover?.(null)}
            onContextMenu={(e) => {
              e.evt.preventDefault();
              onContextMenu?.(building.id, e.evt.clientX, e.evt.clientY);
            }}
          >
            <Rect
              x={px}
              y={py}
              width={pw}
              height={ph}
              fill={color.fill}
              stroke={isSelected ? '#ffd43b' : isHovered ? '#74c0fc' : color.stroke}
              strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 1}
              cornerRadius={2}
            />
            {showLabel && (
              <Text
                x={px + 2}
                y={py + 2}
                width={pw - 4}
                height={ph - 4}
                text={building.name}
                fontSize={Math.min(11, Math.floor(ph / 3))}
                fill={color.text}
                align="center"
                verticalAlign="middle"
                wrap="none"
                ellipsis
                listening={false}
              />
            )}
          </Group>
        );
      })}
    </Layer>
  );
}
