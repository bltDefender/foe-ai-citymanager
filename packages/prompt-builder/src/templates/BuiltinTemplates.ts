import type { PromptTemplate } from '../types/index.js';

export const BALANCED_TEMPLATE: PromptTemplate = {
  id: 'balanced',
  name: 'Balanced Optimization',
  description: 'Balance road efficiency, forge point production, and city happiness',
  tags: ['balanced', 'general', 'beginner'],
  content: `## Balanced City Optimization

Your goal is to create a well-rounded Forge of Empires city that balances multiple objectives:

### Primary Goals
1. **Road Efficiency**: Minimize road tiles while maintaining full connectivity
2. **Forge Point Production**: Maximize Great Buildings and FP-producing buildings
3. **Happiness**: Ensure city happiness remains positive
4. **Production Cycle**: Maintain steady coin and supply production

### Optimization Priorities
- Remove dead-end roads
- Consolidate fragmented free space
- Replace inefficient buildings with higher-tier equivalents
- Ensure all road-required buildings have road access
- Keep at least 5% cultural/decorative buildings for happiness

### Layout Principles
- Use spine-based road networks (one main road with branches)
- Group similar buildings together
- Place Great Buildings at center where accessible
- Keep town hall central for road efficiency`,
};

export const ATTACK_TEMPLATE: PromptTemplate = {
  id: 'attack',
  name: 'Attack Optimization',
  description: 'Maximize attack bonus through military buildings and Great Buildings',
  tags: ['attack', 'military', 'pvp', 'advanced'],
  content: `## Attack-Focused City Optimization

Your goal is to maximize the city's attack bonus for military superiority.

### Primary Goals
1. **Attack Bonus**: Maximize total attack bonus percentage
2. **Military Buildings**: Prioritize high-attack-bonus Great Buildings (Arc, Alcatraz, Castel del Monte)
3. **Troop Production**: Maintain adequate barracks and military buildings
4. **Defense**: Keep defense bonus above 100%

### Key Great Buildings for Attack
- **The Arc** (80 levels): +30% bonus on GBs, crucial for powercreep
- **Alcatraz**: Free troops every 24h
- **Castel del Monte**: Direct attack/defense bonus
- **Notre Dame**: Happiness boost
- **Chateau Frontenac**: Event currency and goods

### Optimization Strategy
- Replace low-value buildings with attack-bonus providers
- Remove roads that don't serve military buildings
- Prioritize GB leveling over residential expansion
- Maintain minimum happiness with cultural buildings`,
};

export const FORGE_POINTS_TEMPLATE: PromptTemplate = {
  id: 'forge_points',
  name: 'Forge Points Optimization',
  description: 'Maximize daily forge point production',
  tags: ['forge-points', 'fp', 'great-buildings', 'economy'],
  content: `## Forge Points Optimization

Your goal is to maximize daily Forge Point (FP) production for faster progression.

### Primary Goals
1. **FP Production**: Maximize FP from all sources
2. **Great Buildings**: Level FP-producing GBs (Observatory, Cape Canaveral, Alcatraz)
3. **Efficiency**: Maximize FP per tile occupied
4. **Sustainability**: Maintain coins/supplies for FP bar

### Top FP-Producing Great Buildings
- **Observatory**: +FP per collection
- **Cape Canaveral**: Significant FP boost
- **Deal Castle**: Coins → FP trade
- **Notre Dame**: Happiness for bigger supply runs
- **Castel del Monte**: Bonus attack/defense + FP

### Optimization Strategy
- Minimize tiles used for non-FP buildings
- Remove goods buildings if you have GBs for goods
- Focus road network on GB accessibility
- Replace small residentials with FP-producing buildings
- Calculate FP/tile ratio for each building`,
};

export const SPACE_SAVING_TEMPLATE: PromptTemplate = {
  id: 'space_saving',
  name: 'Space Saving',
  description: 'Minimize used tiles while maintaining all functions',
  tags: ['space', 'efficiency', 'compact', 'roads'],
  content: `## Space Saving Optimization

Your goal is to minimize total tiles used while maintaining all city functions.

### Primary Goals
1. **Road Reduction**: Achieve < 10% road coverage
2. **Building Consolidation**: Replace multiple small buildings with single larger ones
3. **Efficiency**: Target > 85% efficiency (building tiles / occupied tiles)
4. **Free Space**: Maximize contiguous free rectangle for future expansion

### Optimization Techniques
- **Fishbone Pattern**: One spine road with alternating branches
- **Hub Buildings**: Use buildings that serve as road endpoints
- **Great Building Positioning**: Place GBs to minimize connecting road length
- **Adjacent Placement**: Place buildings to share road access

### Key Metrics
- Road % < 10%: Excellent
- Road % 10-15%: Good
- Road % 15-20%: Acceptable
- Road % > 20%: Needs improvement

### Removal Priority
1. Dead-end roads first
2. Roads serving decorations (move decorations)
3. Duplicate road paths
4. Roads to buildings that can be repositioned`,
};

export const GOODS_TEMPLATE: PromptTemplate = {
  id: 'goods',
  name: 'Goods Production',
  description: 'Optimize for goods production and trading',
  tags: ['goods', 'economy', 'trade', 'production'],
  content: `## Goods Production Optimization

Your goal is to maximize goods production for trading and Great Building leveling.

### Primary Goals
1. **Goods Output**: Maximize daily goods production
2. **Diversity**: Produce all goods types needed for your era
3. **Efficiency**: Maximize goods per tile
4. **Trade Balance**: Ensure goods surplus for trading

### Goods Strategy
- Focus on your era's goods for maximum production
- Keep one of each goods type for trade diversity
- Use goods-producing Great Buildings where possible
- Consider age of goods buildings (newer era = better ratio)

### Building Priority
1. Era-appropriate goods buildings (maximum output)
2. Previous-era goods (for unrefined goods trading)
3. Boost goods with motivation/polishing for 2x output

### Optimization Notes
- Group goods buildings for efficient road access
- Consider placing goods near the map edge for efficient roads
- Balance production time (8h vs 24h goods buildings)`,
};

export const EXPERIMENTAL_TEMPLATE: PromptTemplate = {
  id: 'experimental',
  name: 'Experimental',
  description: 'Creative optimization without constraints',
  tags: ['experimental', 'creative', 'advanced'],
  content: `## Experimental City Optimization

This template allows for creative, unconstrained optimization.

### Approach
Think outside the box. Consider:
- Radical road network restructuring
- Removing ALL decorations to free space
- Mass building replacement with era-appropriate alternatives
- Novel road patterns not commonly used

### Allowed Transformations
- Complete road network redesign
- Building replacement (same category, different specific building)
- Repositioning any building to anywhere
- Removing buildings that provide < 10% of their category's total

### Success Metrics
- Tile efficiency > 90%
- All buildings connected
- Happiness > 0
- FP production same or better
- Attack bonus same or better

Propose the most efficient possible layout, even if it requires major changes.`,
};

export const BUILTIN_TEMPLATES: Record<string, PromptTemplate> = {
  balanced: BALANCED_TEMPLATE,
  attack: ATTACK_TEMPLATE,
  forge_points: FORGE_POINTS_TEMPLATE,
  space_saving: SPACE_SAVING_TEMPLATE,
  goods: GOODS_TEMPLATE,
  experimental: EXPERIMENTAL_TEMPLATE,
};
