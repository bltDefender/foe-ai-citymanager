import React from 'react';
import { BuildingCategory } from '@forgemind/core';
import type { Building } from '@forgemind/core';
import type { ColorScheme } from '../types/index.js';

interface LegendProps {
  readonly buildings: readonly Building[];
  readonly colorScheme: ColorScheme;
}

export function Legend({ buildings, colorScheme }: LegendProps): React.ReactElement {
  const presentCategories = new Set(buildings.map((building) => building.category));
  const entries = Object.values(BuildingCategory).filter((category) => presentCategories.has(category));

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        padding: 8,
        background: 'rgba(0,0,0,0.6)',
        borderRadius: 4,
      }}
    >
      {entries.map((category) => {
        const color = colorScheme[category];
        return (
          <div key={category} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div
              style={{
                width: 12,
                height: 12,
                background: color?.fill ?? '#666',
                border: `1px solid ${color?.stroke ?? '#999'}`,
                borderRadius: 2,
              }}
            />
            <span style={{ fontSize: 11, color: '#ccc' }}>{category}</span>
          </div>
        );
      })}
    </div>
  );
}
