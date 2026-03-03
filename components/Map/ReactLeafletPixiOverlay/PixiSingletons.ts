import { autoDetectRenderer, Container, Renderer } from "pixi.js";

import isWebGLSupported from "features/startup/isWebGLSupported";

let PIXI_MAIN_RENDERER: Renderer | undefined;
let PIXI_AUX_RENDERER: Renderer | undefined;
let PIXI_CONTAINER: Container | undefined;

const RENDERER_OPTIONS = {
  transparent: true,
};

export function clearPixiContainer(): void {
  console.info(`PixiSingletons.clearPixiContainer()`);

  PIXI_CONTAINER?.removeChildren();
}

export function getPixiContainer(): Container {
  if (!isWebGLSupported()) {
    throw new Error("Tried to create a PIXI Container without WebGL");
  }

  if (!PIXI_CONTAINER) {
    PIXI_CONTAINER = new Container();
  }

  return PIXI_CONTAINER;
}

export function getPixiMainRenderer(): Renderer {
  if (!isWebGLSupported()) {
    throw new Error("Tried to create a PIXI Container without WebGL");
  }

  if (!PIXI_MAIN_RENDERER) {
    PIXI_MAIN_RENDERER = autoDetectRenderer(RENDERER_OPTIONS);
  }

  return PIXI_MAIN_RENDERER;
}

export function getPixiAuxRenderer(): Renderer {
  if (!isWebGLSupported()) {
    throw new Error("Tried to create a PIXI Container without WebGL");
  }

  if (!PIXI_AUX_RENDERER) {
    PIXI_AUX_RENDERER = autoDetectRenderer(RENDERER_OPTIONS);
  }

  return PIXI_AUX_RENDERER;
}
