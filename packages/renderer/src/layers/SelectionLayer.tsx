import React from 'react';
import { Layer, Rect } from 'react-konva';
import type { Building, BuildingId } from '@forgemind/core';

interface SelectionLayerProps {
  readonly buildings: readonly Building[];
  readonly selectedIds: Set<BuildingId>;
  readonly hoveredId: BuildingId | null;
  readonly tileSize: number;
}

export function SelectionLayer({ buildings, selectedIds, hoveredId, tileSize }: SelectionLayerProps): React.ReactElement {
  const selectedBuildings = buildings.filter((building) => selectedIds.has(building.id));
  const hoveredBuilding = hoveredId ? buildings.find((building) => building.id === hoveredId) ?? null : null;

  return (
    <Layer listening={false}>
      {selectedBuildings.map((building) => (
        <Rect
          key={`sel-${building.id}`}
          x={building.x * tileSize - 2}
          y={building.y * tileSize - 2}
          width={building.width * tileSize + 4}
          height={building.height * tileSize + 4}
          stroke="#ffd43b"
          strokeWidth={2}
          fill="transparent"
          dash={[4, 2]}
          cornerRadius={3}
        />
      ))}
      {hoveredBuilding && !selectedIds.has(hoveredBuilding.id) && (
        <Rect
          x={hoveredBuilding.x * tileSize - 1}
          y={hoveredBuilding.y * tileSize - 1}
          width={hoveredBuilding.width * tileSize + 2}
          height={hoveredBuilding.height * tileSize + 2}
          stroke="#74c0fc"
          strokeWidth={1.5}
          fill="transparent"
          cornerRadius={3}
        />
      )}
    </Layer>
  );
}
