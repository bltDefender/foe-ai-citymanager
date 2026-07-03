import type { KnowledgeDocument } from '../../types/index.js';
import { KnowledgeCategory, KnowledgeSource } from '../../types/index.js';

export const BALANCED_TEMPLATE_DOC: KnowledgeDocument = {
  meta: {
    id: 'templates/balanced',
    title: 'Balanced City Template',
    version: '1.0',
    author: 'ForgeMind',
    date: '2024-01-01',
    source: KnowledgeSource.Official,
    tags: ['template', 'balanced', 'beginner', 'general'],
    category: KnowledgeCategory.Templates,
  },
  content: `# Balanced City Template

This template provides a solid foundation for a balanced FoE city.

## Core Principles
1. Road efficiency > 80%
2. Happiness always positive
3. FP production growing steadily
4. Production covered without excess

## Building Composition (100 tile budget)

### Essential (cannot remove)
- Town Hall: ~16 tiles
- 2-3 Residential buildings: ~16-24 tiles
- 1-2 Production buildings: ~8 tiles
- Roads: ~15-20 tiles

### Recommended
- 1 Goods building per goods type needed: ~12 tiles
- 2 Cultural buildings: ~8 tiles
- 1 Great Building if available: ~16-25 tiles

### Aspirational
- The Arc
- Notre Dame (replaces cultural buildings)
- Alcatraz (replaces military buildings)

## Layout Pattern
Use spine layout:
\`\`\`
[Town Hall 4x4][R][Residential][Residential]
[Town Hall    ][R][Production ][Production ]  
               [R]
[Goods       ][R][Culture    ][Culture    ]
[Goods       ][R][GB (if any)][           ]
               [R]
\`\`\`

## Expansion Priority
1. Add The Arc when you reach PostModern Era
2. Replace production buildings with goods when FP/goods GBs available
3. Upgrade residential to max era available
4. Remove low-value cultural buildings when Notre Dame is built`,
};
