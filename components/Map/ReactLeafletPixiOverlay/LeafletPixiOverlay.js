import L from "leaflet";
import getMinimumZoomLevelForDestinations from "features/mapping/getMinimumZoomLevelForDestinations";
import * as PIXI from "pixi.js";
import { createUtils } from "./utils";

import {
  AVAILABLE_SPRITE_CACHE,
  MAIN_DESTINATION_SPRITE_CACHE,
  SELECTION_SPRITE_CACHE,
} from "./sprite-caches";

import {
  getPixiContainer,
  getPixiMainRenderer,
  getPixiAuxRenderer,
} from "./PixiSingletons";

import { isDistrict } from "features/mapping";
import { MAIN_DESTINATION_SELECTION_SPRITE_CACHE } from "components/Map/ReactLeafletPixiOverlay/sprite-caches";

const ROUND = L.Point.prototype._round;

function _log(/* message */) {
  // console.info(message);
}

function setInteractionManager(
  interactionManager,
  destroyInteractionManager,
  autoPreventDefault
) {
  if (destroyInteractionManager) {
    interactionManager.destroy();
  } else if (!autoPreventDefault) {
    interactionManager.autoPreventDefault = false;
  }
}

const LeafletPixiOverlay = L.Layer.extend({
  addAreas: async function () {
    _log("LeafletPixiOverlay.addAreas()");
    // Do nothing; we did this on page load
  },

  setSelectedArea: async function (area, setting, zoomLevel) {
    _log(
      `LeafletPixiOverlay.setSelectedArea(${area ? area.name || area.areaKey : area}, zoomLevel=${zoomLevel})`
    );

    const isZoomLevelBelowDestinationThreshold =
      zoomLevel < getMinimumZoomLevelForDestinations(setting);

    // Some logic here. When zoomed in beyond the threshold for showing destinations, we want to toggle
    // selection state on main destinations when districts are selected / deselected

    Object.keys(SELECTION_SPRITE_CACHE).forEach((areaKey) => {
      const selectionSprite = SELECTION_SPRITE_CACHE[areaKey];
      const shouldBeVisible =
        area && // is anything selected?
        area.areaKey === areaKey && // is this area selected?
        (!isDistrict(area) || isZoomLevelBelowDestinationThreshold); // if we're a district, should we show district selection?

      // Turn off selections for everything that isn't this area
      selectionSprite.filters[1].enabled = !shouldBeVisible;
    });

    Object.keys(MAIN_DESTINATION_SELECTION_SPRITE_CACHE).forEach((areaKey) => {
      const sprite = MAIN_DESTINATION_SELECTION_SPRITE_CACHE[areaKey];
      const shouldBeVisible =
        area && // is anything selected?
        area.areaKey === areaKey && // is this area selected?
        !(isDistrict(area) && isZoomLevelBelowDestinationThreshold); // if we're a district, should we show main dest selection?
      sprite.filters[1].enabled = !shouldBeVisible;
    });

    this._renderer.render(this._pixiContainer);
  },

  _updateArea: function (area) {
    _log(
      `LeafletPixiOverlay._updateArea(${area.name || area.areaKey}, isLit=${area.isLit})`
    );
    if (area.isDistrict) {
      // Darken unlit districts
      AVAILABLE_SPRITE_CACHE[area.areaKey].filters[0].enabled = !area.isLit;
      // Hide main destinations for districts we haven't unlocked
      MAIN_DESTINATION_SPRITE_CACHE[area.areaKey].filters[1].enabled =
        !area.shouldShowMainDestination;
    }
  },

  getEvents: function () {
    _log("LeafletPixiOverlay.getEvents()");
    const events = {
      move: this._onMove,
      moveend: this._update,
      zoom: this._onZoom,
    };
    if (this._zoomAnimated) {
      return { ...events, zoomanim: this._onAnimZoom };
    }
    return events;
  },

  onAdd: function (leafletMap) {
    _log("LeafletPixiOverlay.onAdd()");
    this._setMap(leafletMap);
    if (!this._container) {
      const container = (this._container = L.DomUtil.create(
        "div",
        "leaflet-pixi-overlay"
      ));
      container.style.position = "absolute";
      this._renderer = getPixiMainRenderer();
      setInteractionManager(
        this._renderer.plugins.interaction,
        this.options.destroyInteractionManager,
        this.options.autoPreventDefault
      );
      container.appendChild(this._renderer.view);
      if (this._zoomAnimated) {
        L.DomUtil.addClass(container, "leaflet-zoom-animated");
        this._setContainerStyle();
      }
      // Handle double buffering aux renderer
      if (this._doubleBuffering) {
        this._auxRenderer = getPixiAuxRenderer();
        setInteractionManager(
          this._auxRenderer.plugins.interaction,
          this.options.destroyInteractionManager,
          this.options.autoPreventDefault
        );
        container.appendChild(this._auxRenderer.view);
        this._renderer.view.style.position = "absolute";
        this._auxRenderer.view.style.position = "absolute";
      }
    }
    this._addContainer();
    this._setEvents();

    const map = this._map;
    this._initialZoom = this.options.projectionZoom(map);
    this._wgsOrigin = L.latLng([0, 0]);
    this._wgsInitialShift = map.project(this._wgsOrigin, this._initialZoom);
    this._mapInitialZoom = map.getZoom();
    const _layer = this;

    this.utils = createUtils(_layer, map, this);

    // Hello world!
    this._update({ type: "add" });
  },

  onRemove: function () {
    L.DomUtil.remove(this._container);
  },

  options: {
    doubleBuffering: false,
    forceCanvas: false,
    // How much to extend the clip area round the map view (relative to its size)
    // [FL-716]: full viewport's worth in each direction; low-hanging performance fruit
    padding: 1.0,
    // Here's the original, which would give us a value that varied based on the
    // projectionZoom: map => (map.getMaxZoom() + map.getMinZoom()) / 2,
    // Here's an arbitrary value, which is halfway between 3 and 5, that appears to work
    projectionZoom: () => 4,
    resolution: L.Browser.retina ? 2 : 1,
    destroyInteractionManager: false,
    autoPreventDefault: true,
    preserveDrawingBuffer: false,
    clearBeforeRender: true,
    shouldRedrawOnMove: () => false,
  },

  redraw: function (data) {
    if (this._map) {
      const startAt = window.performance.now();
      this._disableLeafletRounding();
      this._drawCallback(this.utils, data);
      this._enableLeafletRounding();
      const duration = (window.performance.now() - startAt) / 1000;
      _log(`LeafletPixiOverlay.redraw() took ${duration.toFixed(2)} s`);
    } else {
      console.error(`LeafletPixiOverlay tried to redraw with no map`);
    }
    return this;
  },

  initialize: function (drawCallback, options = {}) {
    const startAt = window.performance.now();
    L.setOptions(this, options);
    L.stamp(this);
    const duration = (window.performance.now() - startAt) / 1000;
    _log(`LeafletPixiOverlay.initialize() took ${duration.toFixed(2)} s`);

    this._drawCallback = drawCallback;
    this._pixiContainer = getPixiContainer();
    // TODO: set _rendererOptions
    this._rendererOptions = {};
    this._doubleBuffering =
      PIXI.utils.isWebGLSupported() &&
      !this.options.forceCanvas &&
      this.options.doubleBuffering;
  },

  _addContainer: function () {
    _log("LeafletPixiOverlay._addContainer()");
    this.getPane().appendChild(this._container);
  },

  _disableLeafletRounding: function () {
    L.Point.prototype._round = function () {
      return this;
    };
  },

  _enableLeafletRounding: function () {
    L.Point.prototype._round = ROUND;
  },

  _onAnimZoom: function (e) {
    this._updateTransform(e.center, e.zoom);
  },

  _onMove: function (e) {
    if (this.options.shouldRedrawOnMove(e)) {
      this._update(e);
    }
  },

  _onZoom: function () {
    this._updateTransform(this._map.getCenter(), this._map.getZoom());
  },

  _redraw: function (offset, e) {
    let startAt = window.performance.now();
    let duration;
    this._disableLeafletRounding();
    const scale = this._map.getZoomScale(this._zoom, this._initialZoom);
    const shift = this._map
      .latLngToLayerPoint(this._wgsOrigin)
      ._subtract(this._wgsInitialShift.multiplyBy(scale))
      ._subtract(offset);
    this._pixiContainer.scale.set(scale);
    duration = (window.performance.now() - startAt) / 1000;
    _log(`LeafletPixiOverlay._redraw(): scaling took ${duration.toFixed(2)} s`);
    this._pixiContainer.position.set(shift.x, shift.y);
    duration = (window.performance.now() - startAt) / 1000;
    _log(
      `LeafletPixiOverlay._redraw(): positioning took ${duration.toFixed(2)} s`
    );
    this._drawCallback(this.utils, e);
    duration = (window.performance.now() - startAt) / 1000;
    _log(
      `LeafletPixiOverlay._redraw(): draw callback took ${duration.toFixed(2)} s`
    );
    this._enableLeafletRounding();
    _log(`LeafletPixiOverlay._redraw() took ${duration.toFixed(2)} s`);
  },

  _setContainerStyle: function () {},

  _setEvents: function () {},

  _setMap: function () {},

  _resize: function () {
    const startAt = window.performance.now();
    const view = this._renderer.view;
    const size = this._bounds.getSize();

    if (this._renderer.gl) {
      this._renderer.resolution = this.options.resolution;
      if (this._renderer.rootRenderTarget) {
        this._renderer.rootRenderTarget.resolution = this.options.resolution;
      }
    }
    this._renderer.resize(size.x, size.y);
    view.style.width = `${size.x}px`;
    view.style.height = `${size.y}px`;
    if (this._renderer.gl) {
      const gl = this._renderer.gl;
      if (gl.drawingBufferWidth !== this._renderer.width) {
        const resolution =
          (this.options.resolution * gl.drawingBufferWidth) /
          this._renderer.width;
        this._renderer.resolution = resolution;
        if (this._renderer.rootRenderTarget) {
          this._renderer.rootRenderTareget.resolution = resolution;
        }
        this._renderer.resize(size.x, size.y);
      }
    }
    this._renderer.size = size;

    const duration = (window.performance.now() - startAt) / 1000;
    _log(`LeafletPixiOverlay._resize() took ${duration.toFixed(2)} s`);
  },

  _update: function (e) {
    const startAt = window.performance.now();
    // _log('LeafletPixiOverlay._update()');
    // Update pixel bounds of renderer container
    const p = this.options.padding;
    const mapSize = this._map.getSize();
    const min = this._map
      .containerPointToLayerPoint(mapSize.multiplyBy(-p))
      .round();

    this._bounds = new L.Bounds(
      min,
      min.add(mapSize.multiplyBy(1 + p * 2)).round()
    );
    this._center = this._map.getCenter();
    this._zoom = this._map.getZoom();

    // Swap renderers if we're double buffering
    if (this._doubleBuffering) {
      const currentRenderer = this._renderer;
      this._renderer = this._auxRenderer;
      this._auxRenderer = currentRenderer;
    }

    const view = this._renderer.view;
    const b = this._bounds;
    const container = this._container;
    const size = b.getSize();

    // Resize the renderer, if necessary
    if (
      !this._renderer.size ||
      this._renderer.size.x !== size.x ||
      this._renderer.size.y !== size.y
    ) {
      this._resize();
    }

    if (this._doubleBuffering) {
      requestAnimationFrame(() => {
        this._redraw(b.min, e);
        this._renderer.gl.finish();
        view.style.visibility = "visible";
        this._auxRenderer.view.style.visibility = "hidden";
        L.DomUtil.setPosition(container, b.min);
      });
    } else {
      this._redraw(b.min, e);
      L.DomUtil.setPosition(container, b.min);
    }

    const duration = (window.performance.now() - startAt) / 1000;
    _log(`LeafletPixiOverlay._update() took ${duration.toFixed(2)} s`);
  },

  _updateTransform: function (center, zoom) {
    const scale = this._map.getZoomScale(zoom, this._zoom);
    const viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding);
    const currentCenterPoint = this._map.project(this._center, zoom);
    const topLeftOffset = viewHalf
      .multiplyBy(-scale)
      .add(currentCenterPoint)
      .subtract(this._map._getNewPixelOrigin(center, zoom));

    if (L.Browser.any3d) {
      L.DomUtil.setTransform(this._container, topLeftOffset, scale);
    } else {
      L.DomUtil.setPosition(this._container, topLeftOffset);
    }
  },
});

export default LeafletPixiOverlay;
