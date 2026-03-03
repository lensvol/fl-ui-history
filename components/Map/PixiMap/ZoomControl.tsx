import React from "react";

import Control from "react-leaflet-control";

import classnames from "classnames";

import Loading from "components/Loading";

import getMapZoomLimitsForSetting from "features/mapping/getMapZoomLimitsForSetting";

import { IMappableSetting } from "types/map";

import { isRoughlyGTE, isRoughlyLTE } from "utils";

const DEFAULT_ZOOM_DELTA = 0.25;

interface Props {
  setting: IMappableSetting;
  setZoomLevel: (zoomLevel: number, direction?: "in" | "out") => void;
  spriteLoaderProgress: number;
  maxZoom?: number;
  minZoom?: number;
  zoomDelta?: number;
  zoomLevel: number;
}

export default function ZoomControl({
  maxZoom,
  minZoom,
  setting,
  setZoomLevel,
  spriteLoaderProgress,
  zoomDelta,
  zoomLevel,
}: Props) {
  const { max: MAP_MAX_ZOOM, min: MAP_MIN_ZOOM } =
    getMapZoomLimitsForSetting(setting) ?? {};

  if (MAP_MAX_ZOOM === undefined || MAP_MIN_ZOOM === undefined) {
    return null;
  }

  const clampedMaxZoom = Math.min(MAP_MAX_ZOOM, maxZoom ?? MAP_MAX_ZOOM);
  const clampedMinZoom = Math.max(MAP_MIN_ZOOM, minZoom ?? MAP_MIN_ZOOM);

  if (clampedMinZoom === undefined) {
    return null;
  }

  return (
    <Control position="topleft">
      <div
        style={{
          display: "flex",
        }}
      >
        <div>
          <img
            alt="Zoom in"
            className={classnames(
              "leaflet-control--custom-zoom",
              isRoughlyGTE(zoomLevel, clampedMaxZoom) &&
                "leaflet-control--custom-zoom--disabled"
            )}
            onClick={() => {
              setZoomLevel(
                Math.min(
                  clampedMaxZoom,
                  zoomLevel + (zoomDelta ?? DEFAULT_ZOOM_DELTA)
                ),
                "in"
              );
            }}
            src="/map/zoom-plus.png"
          />

          <img
            alt="Zoom out"
            className={classnames(
              "leaflet-control--custom-zoom",
              isRoughlyLTE(zoomLevel, clampedMinZoom) &&
                "leaflet-control--custom-zoom--disabled"
            )}
            onClick={() => {
              setZoomLevel(
                Math.max(
                  clampedMinZoom,
                  zoomLevel - (zoomDelta ?? DEFAULT_ZOOM_DELTA)
                ),
                "out"
              );
            }}
            src="/map/zoom-minus.png"
          />
        </div>

        {spriteLoaderProgress < 100 && (
          <div
            style={{
              display: "flex",
              marginLeft: "8px",
              marginTop: "10px",
              pointerEvents: "none",
            }}
          >
            <Loading
              spinner
              style={{
                height: "28px",
                marginTop: 0,
              }}
            />

            <div
              style={{
                marginLeft: "4px",
              }}
            >
              <div>Loading images...</div>

              <div
                className="progress-bar"
                style={{
                  borderBottom: "none",
                  margin: 0,
                  padding: "2px 0",
                  width: "100px",
                }}
              >
                <span
                  className="progress-bar__stripe progress-bar__stripe--has-transition"
                  style={{
                    transition: "width 0.4s ease-out",
                    width: spriteLoaderProgress,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Control>
  );
}

ZoomControl.displayName = "ZoomControl";
