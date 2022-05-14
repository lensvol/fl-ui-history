import { AdjustmentFilter } from "pixi-filters";
import * as PIXI from "pixi.js";
import { SpriteType } from 'types/map';

export function createUndiscoveredFilter() {
  return new AdjustmentFilter({
    brightness: 0.35,
    saturation: 0.0,
    blue: 1.00,
    green: 1.05,
    red: 0.9,
  });
}

export default function createFiltersForSprite(whatKind: SpriteType) {
  const adj = createUndiscoveredFilter();
  const filters = [adj, new PIXI.filters.AlphaFilter(0)];
  filters[0].enabled = false; // Lit by default
  filters[1].enabled = whatKind === 'selection'; // Visible by default unless it's a selection glow
  return filters;
}
