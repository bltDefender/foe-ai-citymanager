import { z } from 'zod';

export enum ValidationSeverity {
  Error = 'Error',
  Warning = 'Warning',
  Info = 'Info',
}

export interface ValidationIssue {
  readonly code: string;
  readonly severity: ValidationSeverity;
  readonly message: string;
  readonly context: Record<string, unknown>;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ValidationIssue[];
  readonly warnings: readonly ValidationIssue[];
  readonly errors: readonly ValidationIssue[];
}

const RecommendationSchema = z.object({
  id: z.string(),
  reason: z.string(),
  priority: z.number().min(1).max(10),
  confidence: z.number().min(0).max(1),
  impact: z.number().min(0).max(1),
  buildingId: z.string().optional(),
  action: z.enum(['move', 'remove', 'replace', 'add']),
  position: z.object({ x: z.number(), y: z.number() }).optional(),
  newBuildingType: z.string().optional(),
  dependencies: z.array(z.string()),
  tradeoffs: z.array(z.string()),
});

const LayoutBuildingSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
});

const LayoutRoadSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

export const AIOptimizationResponseSchema = z.object({
  version: z.string(),
  summary: z.string(),
  recommendations: z.array(RecommendationSchema),
  layout: z
    .object({
      buildings: z.array(LayoutBuildingSchema),
      roads: z.array(LayoutRoadSchema),
    })
    .optional(),
  warnings: z.array(z.string()),
  metadata: z.object({
    model: z.string(),
    provider: z.string(),
    timestamp: z.string(),
  }),
});

export type AIOptimizationResponse = z.infer<typeof AIOptimizationResponseSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
