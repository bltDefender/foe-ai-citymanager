import type { PromptBlock } from '../types/index.js';
import { PromptBlockType } from '../types/index.js';
import { estimateTokens } from '../estimator/TokenEstimator.js';

const SCHEMA_CONTENT = `## Response Schema

You MUST respond with JSON matching this exact schema:

\`\`\`json
{
  "version": "1.0",
  "summary": "Brief summary of the optimization",
  "recommendations": [
    {
      "id": "unique-recommendation-id",
      "reason": "Why this change improves the city",
      "priority": 8,
      "confidence": 0.9,
      "impact": 0.7,
      "buildingId": "optional-building-id",
      "action": "move|remove|replace|add",
      "position": { "x": 5, "y": 3 },
      "newBuildingType": "optional-building-type-id",
      "dependencies": [],
      "tradeoffs": ["May reduce happiness by 50 points"]
    }
  ],
  "layout": {
    "buildings": [
      { "id": "building-id", "x": 5, "y": 3 }
    ],
    "roads": [
      { "x": 10, "y": 0, "width": 1, "height": 5 }
    ]
  },
  "warnings": [],
  "metadata": {
    "model": "your-model-name",
    "provider": "your-provider-name",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

Field constraints:
- priority: integer 1-10 (10 = most important)
- confidence: float 0-1 (1 = certain)
- impact: float 0-1 (1 = maximum impact)
- action: must be "move", "remove", "replace", or "add"
- All building IDs must reference buildings from the city layout
- All coordinates must be within city bounds`;

export function createSchemaBlock(): PromptBlock {
  return {
    id: 'schema',
    type: PromptBlockType.Schema,
    label: 'Response Schema',
    content: SCHEMA_CONTENT,
    enabled: true,
    order: 5,
    tokenCount: estimateTokens(SCHEMA_CONTENT),
  };
}
