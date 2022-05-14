import { GridLayer } from 'leaflet';

// @ts-ignore
const originalInitTile = GridLayer.prototype._initTile;

let hasWorkaroundBeenApplied = false;

/**
 * Hack the style property of GridLayers to mitigate the issue described in
 * https://github.com/Leaflet/Leaflet/issues/6101
 * (open as of 9 Jan 2020)
 */
export default function applyFractionalTileSizeWorkaround() {
  if (hasWorkaroundBeenApplied) {
    return;
  }

  hasWorkaroundBeenApplied = true;

  GridLayer.include( {
    _initTile: function (tile: any) {
      originalInitTile.call(this, tile);
      const tileSize = this.getTileSize();
      tile.style.width = tileSize.x + 1 + 'px';
      tile.style.height = tileSize.y + 1 + 'px';
    }
  });
}
