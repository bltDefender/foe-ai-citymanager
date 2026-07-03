import { BuildingCategory } from '@forgemind/core';
import type { Building, Road } from '@forgemind/core';
import type { BuildingColor, ColorScheme } from '../types/index.js';

export const CategoryColors: Record<BuildingCategory, BuildingColor> = {
  [BuildingCategory.MainBuilding]: { fill: '#1864ab', stroke: '#1971c2', text: '#ffffff' },
  [BuildingCategory.GreatBuilding]: { fill: '#862e9c', stroke: '#9c36b5', text: '#ffffff' },
  [BuildingCategory.EventBuilding]: { fill: '#e67700', stroke: '#f08c00', text: '#ffffff' },
  [BuildingCategory.Residential]: { fill: '#2b8a3e', stroke: '#37b24d', text: '#ffffff' },
  [BuildingCategory.Production]: { fill: '#e67700', stroke: '#f76707', text: '#ffffff' },
  [BuildingCategory.Goods]: { fill: '#c92a2a', stroke: '#e03131', text: '#ffffff' },
  [BuildingCategory.Military]: { fill: '#495057', stroke: '#868e96', text: '#ffffff' },
  [BuildingCategory.Street]: { fill: '#868e96', stroke: '#adb5bd', text: '#000000' },
  [BuildingCategory.Culture]: { fill: '#0b7285', stroke: '#1098ad', text: '#ffffff' },
  [BuildingCategory.Decoration]: { fill: '#5c940d', stroke: '#74b816', text: '#ffffff' },
  [BuildingCategory.Tower]: { fill: '#364fc7', stroke: '#4263eb', text: '#ffffff' },
  [BuildingCategory.Hub]: { fill: '#5f3dc4', stroke: '#7048e8', text: '#ffffff' },
  [BuildingCategory.Unknown]: { fill: '#343a40', stroke: '#495057', text: '#adb5bd' },
};

export const DEFAULT_COLOR_SCHEME: ColorScheme = CategoryColors;

export function getColorForBuilding(building: Building, colorScheme: ColorScheme = DEFAULT_COLOR_SCHEME): BuildingColor {
  return colorScheme[building.category] ?? colorScheme[BuildingCategory.Unknown] ?? CategoryColors[BuildingCategory.Unknown];
}

export function getColorForRoad(_road: Road, colorScheme: ColorScheme = DEFAULT_COLOR_SCHEME): BuildingColor {
  return colorScheme[BuildingCategory.Street] ?? CategoryColors[BuildingCategory.Street];
}
