import type { KnowledgeDocument } from '../../types/index.js';
import { KnowledgeCategory, KnowledgeSource } from '../../types/index.js';

export const GREAT_BUILDINGS_DOC: KnowledgeDocument = {
  meta: {
    id: 'official/great-buildings',
    title: 'Great Buildings Guide',
    version: '1.0',
    author: 'ForgeMind',
    date: '2024-01-01',
    source: KnowledgeSource.Official,
    tags: ['great-buildings', 'gb', 'arc', 'alcatraz', 'chateau', 'strategy'],
    category: KnowledgeCategory.GreatBuildings,
  },
  content: `# Forge of Empires Great Buildings

Great Buildings (GBs) are the most important buildings in FoE. They provide powerful bonuses that scale with level.

## Priority Great Buildings

### The Arc (PostModern Era)
- **Size**: 5x5
- **Bonus**: Increases bonuses received when donating to other players' GBs
- **Why Build**: At level 80, gives +30% bonus on GB investments — essential for efficient leveling
- **Road Required**: Yes
- **Strategy**: Level to 80 ASAP. This is the most impactful GB investment.

### Alcatraz (Progressive Era)
- **Size**: 5x4
- **Bonus**: Produces free military units every 24 hours
- **Why Build**: Eliminates need for military buildings, freeing tiles
- **Road Required**: Yes
- **Strategy**: Level to 10+ for meaningful troop production

### Chateau Frontenac (Colonial Age)
- **Size**: 4x4
- **Bonus**: Multiplies event currency and goods rewards
- **Why Build**: Essential for event efficiency and goods generation
- **Road Required**: Yes

### Observatory (Bronze Age)
- **Size**: 3x4
- **Bonus**: Provides Forge Points on collection
- **Why Build**: Early FP production for faster research
- **Road Required**: No

### Notre Dame Cathedral (High Middle Ages)
- **Size**: 4x5
- **Bonus**: Provides happiness
- **Why Build**: Replaces many cultural buildings, freeing tiles
- **Road Required**: No

### Cape Canaveral (Tomorrow Era)
- **Size**: 4x5
- **Bonus**: Massive FP production per day
- **Why Build**: Best FP producer in the game
- **Road Required**: Yes

### St. Mark's Basilica (Early Middle Ages)
- **Size**: 5x4
- **Bonus**: Supplies production increase
- **Why Build**: Supplies from a single building replace multiple workshops
- **Road Required**: Yes

### Castel del Monte (High Middle Ages)
- **Size**: 3x3
- **Bonus**: Attack and defense bonus for your army
- **Why Build**: Essential for combat-focused players
- **Road Required**: Yes

## GB Placement Strategy
1. Group GBs together for road efficiency
2. Place high-level GBs in accessible locations (other players need to donate)
3. Keep GBs that don't need roads away from road networks
4. Consider GB footprint when planning city layout

## Leveling Strategy
- Use Arc bonus to get better positions on others' GBs
- Contribute to your own GBs using FP reserves
- Always check the level blueprint ratio before donating`,
};
