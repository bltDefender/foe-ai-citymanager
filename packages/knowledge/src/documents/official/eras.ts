import type { KnowledgeDocument } from '../../types/index.js';
import { KnowledgeCategory, KnowledgeSource } from '../../types/index.js';

export const ERAS_DOC: KnowledgeDocument = {
  meta: {
    id: 'official/eras',
    title: 'FoE Eras Guide',
    version: '1.0',
    author: 'ForgeMind',
    date: '2024-01-01',
    source: KnowledgeSource.Official,
    tags: ['eras', 'progression', 'buildings', 'ages'],
    category: KnowledgeCategory.Eras,
  },
  content: `# Forge of Empires Eras

## Era Progression
FoE has 20 eras, each unlocking new buildings and technologies.

## Early Eras

### Bronze Age (BA)
- Starting era
- Basic huts and stilt houses for residential
- Workshops for production
- Lumber/stone goods
- Dirt roads (1 tile wide)

### Iron Age (IA)
- Improved residential buildings
- Better production yields
- More goods types
- Stone roads available

### Early Middle Ages (EMA)
- Significant upgrade in building efficiency
- Cobblestone roads
- Key GB: St. Mark's Basilica

### High Middle Ages (HMA)
- Population explosion from residential buildings
- Lane roads (better road pattern options)
- Key GBs: Notre Dame, Castel del Monte

### Late Middle Ages (LMA)
- Goods buildings become more efficient
- Paved roads
- Balanced era for most players

## Middle Eras

### Colonial Age (CA)
- Higher tile efficiency
- Key GB: Chateau Frontenac
- Cobblestone roads

### Industrial Age (InA)
- Factory-based production
- Mass residential options

### Progressive Era (PE)
- Key GB: Alcatraz (game-changer for military)
- High-density residential options

### Modern Era (ME)
- High-efficiency buildings
- High Street roads

### PostModern Era (PME)
- Key GB: The Arc (most important in game)
- Efficient cultural buildings

## Advanced Eras

### Contemporary Era (CE) through Space Age Venus (SAV)
- Each era brings progressively better buildings
- Space Age eras have specialized goods
- Fiber roads in future eras provide best bonuses

## Era Strategy
1. Don't rush eras — complete buildings before advancing
2. Keep previous era goods buildings for unrefined goods
3. Key era milestones: get Arc at PME, Alcatraz at PE
4. Some players "age-rush" to reach Arc as quickly as possible`,
};
