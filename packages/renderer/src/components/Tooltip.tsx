import React from 'react';
import type { Building } from '@forgemind/core';

interface TooltipProps {
  readonly building: Building | null;
  readonly position: { readonly x: number; readonly y: number };
  readonly visible: boolean;
}

export function Tooltip({ building, position, visible }: TooltipProps): React.ReactElement | null {
  if (!visible || !building) {
    return null;
  }

  const style: React.CSSProperties = {
    position: 'fixed',
    left: position.x + 12,
    top: position.y + 12,
    background: 'rgba(0,0,0,0.85)',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: 6,
    fontSize: 12,
    pointerEvents: 'none',
    zIndex: 1000,
    minWidth: 160,
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
  };

  return (
    <div style={style}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{building.name}</div>
      <div>Category: {building.category}</div>
      <div>Size: {building.width}×{building.height}</div>
      <div>Era: {building.era}</div>
      <div>Connected: {building.connected ? 'Yes' : 'No'}</div>
      {building.level > 1 && <div>Level: {building.level}</div>}
    </div>
  );
}
