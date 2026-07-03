export const Era = {
  BronzeAge: 'BronzeAge',
  IronAge: 'IronAge',
  EarlyMiddleAges: 'EarlyMiddleAges',
  HighMiddleAges: 'HighMiddleAges',
  LateMiddleAges: 'LateMiddleAges',
  ColonialAge: 'ColonialAge',
  IndustrialAge: 'IndustrialAge',
  ProgressiveEra: 'ProgressiveEra',
  ModernEra: 'ModernEra',
  PostmodernEra: 'PostmodernEra',
  ContemporaryEra: 'ContemporaryEra',
  TomorrowEra: 'TomorrowEra',
  FutureEra: 'FutureEra',
  ArcticFuture: 'ArcticFuture',
  OceanicFuture: 'OceanicFuture',
  VirtualFuture: 'VirtualFuture',
  SpaceAgeMars: 'SpaceAgeMars',
  SpaceAgeAsteroidBelt: 'SpaceAgeAsteroidBelt',
  SpaceAgeVenus: 'SpaceAgeVenus',
  Unknown: 'Unknown',
} as const;

export type Era = (typeof Era)[keyof typeof Era];
