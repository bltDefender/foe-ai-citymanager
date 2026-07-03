import React, { useEffect, useRef } from 'react';
import type { City } from '@forgemind/core';
import type { ViewportState } from '../types/index.js';
import { CategoryColors } from '../colors/index.js';

interface MinimapProps {
  readonly city: City;
  readonly viewport: ViewportState;
  readonly tileSize: number;
  readonly width: number;
  readonly height: number;
}

export function Minimap({ city, viewport, tileSize, width, height }: MinimapProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scaleX = width / city.width;
  const scaleY = height / city.height;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#1a1b1e';
    ctx.fillRect(0, 0, width, height);

    for (const road of city.roads) {
      ctx.fillStyle = '#868e96';
      ctx.fillRect(road.x * scaleX, road.y * scaleY, road.width * scaleX, road.height * scaleY);
    }

    for (const building of city.buildings) {
      const color = CategoryColors[building.category];
      ctx.fillStyle = color?.fill ?? '#333';
      ctx.fillRect(building.x * scaleX, building.y * scaleY, building.width * scaleX, building.height * scaleY);
    }

    const vpX = (-viewport.x / tileSize / viewport.scale) * scaleX;
    const vpY = (-viewport.y / tileSize / viewport.scale) * scaleY;
    const vpW = (viewport.width / tileSize / viewport.scale) * scaleX;
    const vpH = (viewport.height / tileSize / viewport.scale) * scaleY;

    ctx.strokeStyle = '#ffd43b';
    ctx.lineWidth = 1;
    ctx.strokeRect(vpX, vpY, vpW, vpH);
  }, [city, viewport, tileSize, width, height, scaleX, scaleY]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: '1px solid #444', borderRadius: 4, display: 'block' }}
    />
  );
}
