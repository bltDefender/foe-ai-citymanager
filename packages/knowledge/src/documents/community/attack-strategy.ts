import type { KnowledgeDocument } from '../../types/index.js';
import { KnowledgeCategory, KnowledgeSource } from '../../types/index.js';

export const ATTACK_STRATEGY_DOC: KnowledgeDocument = {
  meta: {
    id: 'community/attack-strategy',
    title: 'Attack Bonus Strategy',
    version: '1.0',
    author: 'ForgeMind Community',
    date: '2024-01-01',
    source: KnowledgeSource.Community,
    tags: ['attack', 'military', 'bonus', 'strategy', 'pvp', 'great-buildings'],
    category: KnowledgeCategory.Strategies,
  },
  content: `# Attack Bonus Optimization Strategy

## Why Attack Bonus Matters
In FoE PvP and GvG, attack bonus directly determines battle outcomes.
Higher attack % = win more battles = more rewards.

## Attack Bonus Sources

### Great Buildings (Best Sources)
- **Castel del Monte**: +att/def bonus per level
- **Zeus Statue**: Pure attack bonus
- **Notre Dame**: Indirect (happiness → full production → more resources for troops)
- **Deal Castle**: Coins for FP, not direct attack but economy
- **Alcatraz**: Free troops (no direct % bonus but army replenishment)

### Military Buildings  
- Era-appropriate military buildings provide attack bonus when leveled
- Higher era = higher base attack bonus
- But they use space — GBs are more space-efficient

## Building the Attack City

### Priority Order
1. Build The Arc to level 80 (prerequisite)
2. Build Castel del Monte, level aggressively
3. Build Zeus Statue (Bronze Age GB)
4. Add Alcatraz for troop supply
5. Maintain minimum residential for population
6. Keep happiness positive (Notre Dame or cultural buildings)

### Tile Budget Example (20x20 = 400 tiles)
- Town Hall: 4x4 = 16 tiles
- Arc (5x5): 25 tiles  
- Alcatraz (5x4): 20 tiles
- Castel del Monte (3x3): 9 tiles
- 2 residentials (2x2 each): 8 tiles
- Cultural buildings: 10 tiles
- Roads: ~30 tiles (7.5%)
Total: ~118 tiles used, 282 free for additional GBs/military

### Attack % Targets
- 100% attack: Beginner (wins most PvP)
- 200% attack: Good (wins most neighborhood fights)
- 500% attack: Competitive (GvG viable)
- 1000%+ attack: Top tier (dominates events)

## Goods vs. Attack Trade-off
- Goods buildings use space that could hold attack GBs
- Solution: Use Alcatraz for unattached goods, Arc for GB donations
- Remove all goods buildings once corresponding GBs exist
- Trade for goods rather than producing them`,
};
