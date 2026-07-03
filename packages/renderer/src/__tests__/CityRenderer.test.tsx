import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BuildingCategory, BuildingState, Era, RoadType, makeBuildingId, makeCityId, makeRoadId } from '@forgemind/core';
import type { Building, City, Road } from '@forgemind/core';
import { CityRenderer } from '../CityRenderer.js';

vi.mock('react-konva', () => ({
  Stage: ({ children, onClick }: { children: React.ReactNode; onClick?: (event: unknown) => void }) => (
    <div
      data-testid="stage"
      onClick={() => {
        const target = { getStage: () => target };
        onClick?.({ target });
      }}
    >
      {children}
    </div>
  ),
  Layer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Rect: () => <div data-testid="rect" />,
  Text: () => <div data-testid="text" />,
  Group: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Line: () => <div data-testid="line" />,
}));

function makeTestCity(): City {
  const building: Building = {
    id: makeBuildingId('b1'),
    entityId: 'Residential_Test',
    name: 'Test House',
    type: BuildingCategory.Residential,
    category: BuildingCategory.Residential,
    x: 0,
    y: 0,
    width: 2,
    height: 2,
    rotation: 0,
    connected: true,
    roadRequired: true,
    era: Era.BronzeAge,
    level: 1,
    state: BuildingState.Idle,
    productions: [],
    bonuses: [],
    tags: [],
    metadata: {},
  };

  const road: Road = {
    id: makeRoadId('r1'),
    x: 2,
    y: 0,
    width: 1,
    height: 1,
    roadType: RoadType.Paved,
    connected: true,
    era: Era.BronzeAge,
    metadata: {},
  };

  return {
    id: makeCityId('city1'),
    width: 10,
    height: 10,
    era: Era.BronzeAge,
    owner: 'TestPlayer',
    buildings: [building],
    roads: [road],
    statistics: null,
    metadata: {
      gameVersion: '1.0',
      exportDate: new Date(),
      foeHelperVersion: '1.0',
      playerName: 'TestPlayer',
      era: Era.BronzeAge,
      source: 'test',
      checksum: '',
    },
    analysis: null,
  };
}

describe('CityRenderer', () => {
  it('renders without crashing', () => {
    const city = makeTestCity();
    const { container } = render(<CityRenderer city={city} width={400} height={300} />);
    expect(container).toBeTruthy();
  });

  it('renders with custom config', () => {
    const city = makeTestCity();
    const { container } = render(
      <CityRenderer city={city} config={{ showGrid: false, tileSize: 32 }} width={400} height={300} />,
    );
    expect(container).toBeTruthy();
  });

  it('renders with selected buildings', () => {
    const city = makeTestCity();
    const selectedIds = new Set([makeBuildingId('b1')]);
    const { container } = render(
      <CityRenderer city={city} selectedBuildingIds={selectedIds} width={400} height={300} />,
    );
    expect(container).toBeTruthy();
  });

  it('calls onDeselectAll when stage is clicked', () => {
    const city = makeTestCity();
    const onDeselectAll = vi.fn();
    const { getByTestId } = render(
      <CityRenderer city={city} onDeselectAll={onDeselectAll} width={400} height={300} />,
    );

    getByTestId('stage').click();
    expect(onDeselectAll).toHaveBeenCalledTimes(1);
  });
});
