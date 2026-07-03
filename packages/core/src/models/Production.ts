export interface Resources {
  readonly coins: number;
  readonly supplies: number;
  readonly forgePoints: number;
  readonly goods: number;
  readonly units: number;
  readonly happiness: number;
}

export interface SpecialReward {
  readonly type: string;
  readonly quantity: number;
}

export interface Production {
  readonly duration: number;
  readonly resources: Resources;
  readonly guildResources: Partial<Resources>;
  readonly specialRewards: readonly SpecialReward[];
  readonly randomRewards: readonly SpecialReward[];
}
