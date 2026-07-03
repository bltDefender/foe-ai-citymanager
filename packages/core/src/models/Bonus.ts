export const BonusType = {
  Attack: 'Attack',
  Defense: 'Defense',
  ForgePoints: 'ForgePoints',
  Population: 'Population',
  Goods: 'Goods',
  Happiness: 'Happiness',
  RoadEfficiency: 'RoadEfficiency',
  GuildGoods: 'GuildGoods',
  Special: 'Special',
} as const;

export type BonusType = (typeof BonusType)[keyof typeof BonusType];

export interface Bonus {
  readonly type: BonusType;
  readonly value: number;
  readonly percentage: boolean;
  readonly description: string;
}
