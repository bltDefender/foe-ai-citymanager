import type { City } from '@forgemind/core';
import type { PromptBlock } from '../types/index.js';
import { PromptBlockType } from '../types/index.js';
import { estimateTokens } from '../estimator/TokenEstimator.js';

interface CompactBuilding {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  w: number;
  h: number;
  era: string;
  level: number;
  road: boolean;
  connected: boolean;
}

interface CompactRoad {
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
}

interface CompactCity {
  owner: string;
  playerName: string;
  width: number;
  height: number;
  era: string;
  buildings: CompactBuilding[];
  roads: CompactRoad[];
}

export function createCityBlock(city: City): PromptBlock {
  const compact: CompactCity = {
    owner: city.owner,
    playerName: city.metadata.playerName,
    width: city.width,
    height: city.height,
    era: city.era,
    buildings: city.buildings.map((building) => ({
      id: String(building.id),
      name: building.name,
      category: building.category,
      x: building.x,
      y: building.y,
      w: building.width,
      h: building.height,
      era: building.era,
      level: building.level,
      road: building.roadRequired,
      connected: building.connected,
    })),
    roads: city.roads.map((road) => ({
      x: road.x,
      y: road.y,
      w: road.width,
      h: road.height,
      type: road.roadType,
    })),
  };

  const content = `## Current City Layout

\`\`\`json
${JSON.stringify(compact, null, 2)}
\`\`\``;

  return {
    id: 'city',
    type: PromptBlockType.City,
    label: 'City Layout',
    content,
    enabled: true,
    order: 3,
    tokenCount: estimateTokens(content),
  };
}
