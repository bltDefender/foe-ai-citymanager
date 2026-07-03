import type { KnowledgeDocument } from '../../types/index.js';
import { KnowledgeCategory, KnowledgeSource } from '../../types/index.js';

export const GAME_MECHANICS_DOC: KnowledgeDocument = {
  meta: {
    id: 'official/game-mechanics',
    title: 'FoE Game Mechanics',
    version: '1.0',
    author: 'ForgeMind',
    date: '2024-01-01',
    source: KnowledgeSource.Official,
    tags: ['mechanics', 'roads', 'buildings', 'production', 'population', 'happiness'],
    category: KnowledgeCategory.GameMechanics,
  },
  content: `# Forge of Empires Game Mechanics

## Road Connectivity
Roads are essential for many buildings. Buildings marked as "road required" must be adjacent (sharing an edge, not just a corner) to at least one road tile to function properly. Without road connectivity:
- The building produces no coins, supplies, or goods
- Collection is disabled
- The building appears "disconnected" in FoE Helper exports

## Building Categories

### Residential Buildings
- Generate coins every X hours
- Require road connectivity
- Must be motivated for double coin output
- Population determines how many goods/production buildings you can have

### Production Buildings  
- Generate supplies every X hours
- Require road connectivity
- Must be motivated for double supply output
- Supplies are needed for research, forge points, and troop training

### Goods Buildings
- Produce era-specific goods (e.g., lumber in Bronze Age, rubber in Modern Era)
- Require road connectivity
- 24h productions give better FP/time ratios
- Goods are used for research, trading, and Great Building leveling

### Great Buildings
- Provide powerful passive bonuses
- May or may not require roads
- Leveled using Forge Point donations from other players
- Key examples: The Arc (GB bonus), Alcatraz (free troops), Observatory (FP)

### Cultural Buildings
- Increase happiness
- Most do NOT require roads
- Happiness affects productivity: when happy > 0, production is normal; when sad, production halves

### Military Buildings
- Train troops for PvP and GvG
- Require road connectivity
- Different building types for different unit types

## Happiness System
- Happiness = sum of all culture building values - population needs
- Positive happiness: normal production
- Negative happiness (sad): all productions halved
- Strategy: maintain happiness with minimal cultural tile usage

## Forge Points (FP)
- FP bar fills over time (1 FP per hour by default)
- Used to research technologies and level Great Buildings
- Some buildings and GBs provide additional FP

## Efficiency Metric
Efficiency = building tiles / (building tiles + road tiles)
- Higher = better (more tiles used for buildings, less for roads)
- Target: > 80% efficiency
- < 60% efficiency indicates too many road tiles

## Road Patterns

### Spine Layout
- One main road runs through city center
- Short branch roads extend to clusters of buildings
- Most efficient layout for most cities
- Minimizes road tiles while maintaining connectivity

### Fishbone Layout
- Diagonal main road
- Branch roads alternate sides
- Efficient for narrow city configurations

### Hub Layout
- Roads extend from a central hub
- Works well when buildings cluster around GB areas`,
};
