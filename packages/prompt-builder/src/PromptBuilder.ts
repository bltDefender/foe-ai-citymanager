import type { Analysis, City } from '@forgemind/core';
import type { LLMMessage } from '@forgemind/llm';
import type { OptimizationGoal, PromptBlock, PromptPackage, PromptTemplate } from './types/index.js';
import { PromptBlockType } from './types/index.js';
import { createAnalysisBlock } from './blocks/AnalysisBlock.js';
import { createCityBlock } from './blocks/CityBlock.js';
import { createGoalsBlock } from './blocks/GoalsBlock.js';
import { createHistoryBlock } from './blocks/HistoryBlock.js';
import { createKnowledgeBlock } from './blocks/KnowledgeBlock.js';
import { createSchemaBlock } from './blocks/SchemaBlock.js';
import { createSystemPromptBlock } from './blocks/SystemPromptBlock.js';
import { estimateTokens } from './estimator/TokenEstimator.js';

export class PromptBuilder {
  private template: PromptTemplate | null = null;
  private goals: OptimizationGoal[] = [];
  private city: City | null = null;
  private analysis: Analysis | null = null;
  private history: LLMMessage[] = [];
  private knowledge: string[] = [];
  private readonly disabledBlocks = new Set<PromptBlockType>();

  setTemplate(template: PromptTemplate): void {
    this.template = template;
  }

  setGoals(goals: OptimizationGoal[]): void {
    this.goals = goals;
  }

  setCity(city: City): void {
    this.city = city;
  }

  setAnalysis(analysis: Analysis): void {
    this.analysis = analysis;
  }

  setHistory(messages: LLMMessage[]): void {
    this.history = messages;
  }

  setKnowledge(docs: string[]): void {
    this.knowledge = docs;
  }

  setBlockEnabled(blockType: PromptBlockType, enabled: boolean): void {
    if (enabled) {
      this.disabledBlocks.delete(blockType);
    } else {
      this.disabledBlocks.add(blockType);
    }
  }

  build(): PromptPackage {
    const blocks: PromptBlock[] = [];

    const maybeAddBlock = (block: PromptBlock): void => {
      if (block.enabled && !this.disabledBlocks.has(block.type)) {
        blocks.push(block);
      }
    };

    maybeAddBlock(createSystemPromptBlock());
    maybeAddBlock(createKnowledgeBlock(this.knowledge));

    if (this.template) {
      maybeAddBlock({
        id: `template-${this.template.id}`,
        type: PromptBlockType.Template,
        label: this.template.name,
        content: this.template.content,
        enabled: true,
        order: 2,
        tokenCount: estimateTokens(this.template.content),
      });
    }

    maybeAddBlock(createGoalsBlock(this.goals));

    if (this.city) {
      maybeAddBlock(createCityBlock(this.city));
    }

    if (this.analysis) {
      maybeAddBlock(createAnalysisBlock(this.analysis));
    }

    maybeAddBlock(createSchemaBlock());
    maybeAddBlock(createHistoryBlock(this.history));

    const sortedBlocks = blocks.sort((a, b) => a.order - b.order);
    const totalTokens = sortedBlocks.reduce((sum, block) => sum + block.tokenCount, 0);

    return {
      id: `pkg-${Date.now()}`,
      blocks: sortedBlocks,
      template: this.template,
      goals: this.goals,
      city: this.city,
      analysis: this.analysis,
      timestamp: new Date(),
      totalTokens,
    };
  }

  buildMessages(): LLMMessage[] {
    const pkg = this.build();
    const systemBlocks = pkg.blocks.filter((block) => block.type === PromptBlockType.System);
    const systemContent = systemBlocks.map((block) => block.content).join('\n\n');

    const userBlocks = pkg.blocks.filter(
      (block) => block.type !== PromptBlockType.System && block.type !== PromptBlockType.History,
    );
    const userContent = userBlocks.map((block) => block.content).join('\n\n');

    const messages: LLMMessage[] = [];
    if (systemContent) {
      messages.push({ role: 'system', content: systemContent });
    }
    if (this.history.length > 0) {
      messages.push(...this.history.filter((message) => message.role !== 'system'));
    }
    messages.push({ role: 'user', content: userContent });

    return messages;
  }
}
