import L from "leaflet";

import { LatLng, Layer, Map, Point, ImageOverlay } from "leaflet";
import { Container as PixiContainer, Renderer as PixiRenderer } from "pixi.js";
import { IArea, ISetting } from "types/map";
import { IUtils } from "components/Map/ReactLeafletPixiOverlay/types";

type LeafletPixiLayer = Layer & {
  _initialZoom: number;
  _map: Map;
  _pixiContainer: PixiContainer;
  _renderer: PixiRenderer;
};

type LeafletPixiOverlay = ImageOverlay & {
  addAreas: (areas: IArea[]) => void;
  getContainer: () => PixiContainer;
  getRenderer: () => PixiRenderer;
  setSelectedArea: (area: IArea, setting: ISetting, zoomLevel: number) => void;
};

export const createUtils: (
  layer: LeafletPixiLayer,
  map: Map,
  overlay: LeafletPixiOverlay
) => IUtils = (layer, map, overlay) => {
  return {
    addAreas: (areas: IArea[]) => overlay.addAreas(areas),

    getContainer: () => layer._pixiContainer,

    getMap: () => layer._map,

    getRenderer: () => layer._renderer,

    getScale: (_zoom: number | undefined) => {
      if (_zoom === undefined) {
        return map.getZoomScale(map.getZoom(), layer._initialZoom);
      }
      return map.getZoomScale(_zoom, layer._initialZoom);
    },

    layerPointtoLatLng: (point: Point, _zoom: number | undefined) => {
      const zoom = _zoom === undefined ? layer._initialZoom : _zoom;
      return map.unproject(L.point(point), zoom);
    },

    latLngToLayerPoint: (latLng: LatLng, _zoom: number | undefined) => {
      const zoom = _zoom === undefined ? layer._initialZoom : _zoom;
      return map.project(L.latLng(latLng), zoom);
    },

    setSelectedArea: (
      selectedArea: IArea,
      setting: ISetting,
      zoomLevel: number
    ) => {
      overlay.setSelectedArea(selectedArea, setting, zoomLevel);
    },
  };
};
