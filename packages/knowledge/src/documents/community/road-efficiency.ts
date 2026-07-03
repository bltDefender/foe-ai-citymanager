import type { KnowledgeDocument } from '../../types/index.js';
import { KnowledgeCategory, KnowledgeSource } from '../../types/index.js';

export const ROAD_EFFICIENCY_DOC: KnowledgeDocument = {
  meta: {
    id: 'community/road-efficiency',
    title: 'Road Efficiency Strategies',
    version: '1.0',
    author: 'ForgeMind Community',
    date: '2024-01-01',
    source: KnowledgeSource.Community,
    tags: ['roads', 'efficiency', 'optimization', 'layout', 'fishbone', 'spine'],
    category: KnowledgeCategory.Strategies,
  },
  content: `# Road Efficiency Strategies

## Why Road Efficiency Matters
Each road tile is a wasted tile. The goal is to connect all road-required buildings using the minimum number of road tiles possible.

## Key Metrics
- Road % < 10%: Excellent
- Road % 10-15%: Good  
- Road % 15-20%: Acceptable
- Road % > 20%: Needs optimization

## Road Patterns

### 1. Spine Layout (Recommended)
\`\`\`
BBBB BBBB BBBB
BBBB R    BBBB
BBBB R    BBBB
     R
BBBB R    BBBB
BBBB R    BBBB
\`\`\`
One main road (spine) runs vertically/horizontally through the city.
Buildings are placed on both sides of the spine.
Branch roads (1-2 tiles) extend to buildings that can't directly touch the spine.

**Advantages**:
- Minimal road tiles
- Easy to extend
- Works for any city size

### 2. Fishbone Layout
\`\`\`
BBBB
 R  BBBB
  R
   R BBBB
    R
     R BBBB
\`\`\`
A diagonal "spine" with alternating branches.
Good for narrow maps or large buildings.

### 3. Loop Layout
\`\`\`
R R R R R
R B B B R
R B B B R  
R B B B R
R R R R R
\`\`\`
A perimeter road loop with buildings inside.
Ensures every building is adjacent to the road.
Higher road percentage but guarantees connectivity.

## Dead End Elimination
Dead end roads (roads with only one connection) are always wasteful:
1. Identify dead ends (roads touching only one other road tile)
2. Check if any building requires that dead end
3. If not, remove it
4. Repeat until no more removable dead ends

## Building Cluster Optimization
Group similar buildings together to minimize road branches:
- All residential in one area → one road segment serves all
- Production cluster → one short road
- Goods buildings together → minimal road needed

## Adjacent Building Technique
Place buildings so their edges align with a single road tile:
\`\`\`
B B R B B
B B R B B
\`\`\`
Two buildings on each side of a 1-tile road — maximum efficiency.

## Target Efficiency
- Aim for > 85% efficiency (building tiles / all occupied tiles)
- Every road tile removed increases efficiency by: 1/(total_tiles) * 100%
- Removing 10 roads from a 400-tile city = +2.5% efficiency`,
};
