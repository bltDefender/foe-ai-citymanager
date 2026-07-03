import { Era } from '@forgemind/core';

const ERA_MAP: Record<string, Era> = {
  BronzeAge: Era.BronzeAge,
  BA: Era.BronzeAge,
  IronAge: Era.IronAge,
  IA: Era.IronAge,
  EarlyMiddleAges: Era.EarlyMiddleAges,
  EMA: Era.EarlyMiddleAges,
  HighMiddleAges: Era.HighMiddleAges,
  HMA: Era.HighMiddleAges,
  LateMiddleAges: Era.LateMiddleAges,
  LMA: Era.LateMiddleAges,
  ColonialAge: Era.ColonialAge,
  CA: Era.ColonialAge,
  IndustrialAge: Era.IndustrialAge,
  InA: Era.IndustrialAge,
  ProgressiveEra: Era.ProgressiveEra,
  PE: Era.ProgressiveEra,
  ModernEra: Era.ModernEra,
  ME: Era.ModernEra,
  PostmodernEra: Era.PostmodernEra,
  PME: Era.PostmodernEra,
  ContemporaryEra: Era.ContemporaryEra,
  CE: Era.ContemporaryEra,
  TomorrowEra: Era.TomorrowEra,
  TE: Era.TomorrowEra,
  FutureEra: Era.FutureEra,
  FE: Era.FutureEra,
  ArcticFuture: Era.ArcticFuture,
  AF: Era.ArcticFuture,
  OceanicFuture: Era.OceanicFuture,
  OF: Era.OceanicFuture,
  VirtualFuture: Era.VirtualFuture,
  VF: Era.VirtualFuture,
  SpaceAgeMars: Era.SpaceAgeMars,
  SAM: Era.SpaceAgeMars,
  SpaceAgeAsteroidBelt: Era.SpaceAgeAsteroidBelt,
  SAAB: Era.SpaceAgeAsteroidBelt,
  SpaceAgeVenus: Era.SpaceAgeVenus,
  SAV: Era.SpaceAgeVenus,
  Unknown: Era.Unknown,
};

export function mapEra(raw: string | undefined | null): Era {
  if (!raw) return Era.Unknown;
  const mapped = ERA_MAP[raw];
  if (mapped) return mapped;
  const lower = raw.toLowerCase();
  for (const [key, value] of Object.entries(ERA_MAP)) {
    if (key.toLowerCase() === lower) return value;
  }
  return Era.Unknown;
}
