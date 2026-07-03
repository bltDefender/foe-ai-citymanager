import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Stage } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node.js';
import type { BuildingId, City, HeatmapCell } from '@forgemind/core';
import type { RenderConfig, ViewportState } from './types/index.js';
import { DEFAULT_COLOR_SCHEME } from './colors/index.js';
import { Tooltip } from './components/Tooltip.js';
import { BuildingLayer } from './layers/BuildingLayer.js';
import { GridLayer } from './layers/GridLayer.js';
import { HeatmapLayer } from './layers/HeatmapLayer.js';
import { RoadLayer } from './layers/RoadLayer.js';
import { SelectionLayer } from './layers/SelectionLayer.js';

const DEFAULT_CONFIG: RenderConfig = {
  tileSize: 48,
  showGrid: true,
  showTooltips: true,
  showCoordinates: false,
  colorScheme: DEFAULT_COLOR_SCHEME,
};

interface CityRendererProps {
  readonly city: City;
  readonly config?: Partial<RenderConfig>;
  readonly selectedBuildingIds?: Set<BuildingId>;
  readonly heatmap?: readonly HeatmapCell[];
  readonly showHeatmap?: boolean;
  readonly onSelectBuilding?: (id: BuildingId, multi: boolean) => void;
  readonly onDeselectAll?: () => void;
  readonly onContextMenu?: (id: BuildingId, x: number, y: number) => void;
  readonly width?: number;
  readonly height?: number;
}

export function CityRenderer({
  city,
  config: configOverride,
  selectedBuildingIds = new Set<BuildingId>(),
  heatmap = [],
  showHeatmap = false,
  onSelectBuilding,
  onDeselectAll,
  onContextMenu,
  width = 800,
  height = 600,
}: CityRendererProps): React.ReactElement {
  const config = useMemo<RenderConfig>(
    () => ({
      ...DEFAULT_CONFIG,
      ...configOverride,
      colorScheme: configOverride?.colorScheme ?? DEFAULT_COLOR_SCHEME,
    }),
    [configOverride],
  );
  const [viewport, setViewport] = useState<ViewportState>({ x: 0, y: 0, scale: 1, width, height });
  const [hoveredId, setHoveredId] = useState<BuildingId | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const hoveredBuilding = hoveredId ? city.buildings.find((building) => building.id === hoveredId) ?? null : null;

  useEffect(() => {
    setViewport((previous) => ({ ...previous, width, height }));
  }, [width, height]);

  const handleWheel = useCallback(
    (event: KonvaEventObject<WheelEvent>) => {
      event.evt.preventDefault();
      const stage = event.target.getStage();
      if (!stage) {
        return;
      }

      const pointer = stage.getPointerPosition();
      if (!pointer) {
        return;
      }

      const scaleBy = 1.08;
      const oldScale = viewport.scale;
      const nextScale = event.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      const clampedScale = Math.min(Math.max(nextScale, 0.1), 5);
      const mousePointTo = {
        x: (pointer.x - viewport.x) / oldScale,
        y: (pointer.y - viewport.y) / oldScale,
      };

      setViewport((previous) => ({
        ...previous,
        scale: clampedScale,
        x: pointer.x - mousePointTo.x * clampedScale,
        y: pointer.y - mousePointTo.y * clampedScale,
      }));
    },
    [viewport.scale, viewport.x, viewport.y],
  );

  const handleMouseDown = useCallback((event: KonvaEventObject<MouseEvent>) => {
    if (event.evt.button === 1 || (event.evt.button === 0 && event.evt.altKey)) {
      setIsPanning(true);
      lastPos.current = { x: event.evt.clientX, y: event.evt.clientY };
    }
  }, []);

  const handleMouseMove = useCallback((event: KonvaEventObject<MouseEvent>) => {
    setTooltipPos({ x: event.evt.clientX, y: event.evt.clientY });

    if (!isPanning) {
      return;
    }

    const dx = event.evt.clientX - lastPos.current.x;
    const dy = event.evt.clientY - lastPos.current.y;
    lastPos.current = { x: event.evt.clientX, y: event.evt.clientY };
    setViewport((previous) => ({ ...previous, x: previous.x + dx, y: previous.y + dy }));
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleStageClick = useCallback((event: KonvaEventObject<MouseEvent>) => {
    if (event.target === event.target.getStage()) {
      onDeselectAll?.();
    }
  }, [onDeselectAll]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const panAmount = 20;
      switch (event.key) {
        case 'ArrowLeft':
          setViewport((previous) => ({ ...previous, x: previous.x + panAmount }));
          break;
        case 'ArrowRight':
          setViewport((previous) => ({ ...previous, x: previous.x - panAmount }));
          break;
        case 'ArrowUp':
          setViewport((previous) => ({ ...previous, y: previous.y + panAmount }));
          break;
        case 'ArrowDown':
          setViewport((previous) => ({ ...previous, y: previous.y - panAmount }));
          break;
        case '+':
        case '=':
          setViewport((previous) => ({ ...previous, scale: Math.min(previous.scale * 1.1, 5) }));
          break;
        case '-':
          setViewport((previous) => ({ ...previous, scale: Math.max(previous.scale / 1.1, 0.1) }));
          break;
        case 'Escape':
          onDeselectAll?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDeselectAll]);

  return (
    <div style={{ position: 'relative', width, height, overflow: 'hidden', background: '#1a1b1e' }}>
      <Stage
        width={width}
        height={height}
        x={viewport.x}
        y={viewport.y}
        scaleX={viewport.scale}
        scaleY={viewport.scale}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleStageClick}
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
        {config.showGrid && (
          <GridLayer columns={city.width} rows={city.height} tileSize={config.tileSize} />
        )}
        <RoadLayer roads={city.roads} tileSize={config.tileSize} colorScheme={config.colorScheme} />
        <BuildingLayer
          buildings={city.buildings}
          tileSize={config.tileSize}
          colorScheme={config.colorScheme}
          selectedIds={selectedBuildingIds}
          hoveredId={hoveredId}
          onSelect={onSelectBuilding}
          onHover={setHoveredId}
          onContextMenu={onContextMenu}
        />
        <SelectionLayer
          buildings={city.buildings}
          selectedIds={selectedBuildingIds}
          hoveredId={hoveredId}
          tileSize={config.tileSize}
        />
        {showHeatmap && (
          <HeatmapLayer cells={heatmap} tileSize={config.tileSize} opacity={0.6} visible={showHeatmap} />
        )}
      </Stage>
      {config.showTooltips && (
        <Tooltip building={hoveredBuilding} position={tooltipPos} visible={Boolean(hoveredBuilding)} />
      )}
    </div>
  );
}
