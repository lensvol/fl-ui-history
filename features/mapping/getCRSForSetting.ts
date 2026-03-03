import { CRS, Transformation } from "leaflet";

import getMapZoomLimitsForSetting from "features/mapping/getMapZoomLimitsForSetting";
import { getMapDimensionsForSetting } from "features/mapping/index";

import { IMappableSetting } from "types/map";

export default function getCRSForSetting(setting: IMappableSetting) {
  const { height: mapHeight, width: mapWidth } =
    getMapDimensionsForSetting(setting);

  const { max: mapMaxZoom } = getMapZoomLimitsForSetting(setting) ?? {};

  if (mapMaxZoom === undefined) {
    return undefined;
  }

  const tileExtent = [0, -mapHeight, mapWidth, 0];

  const mapMaxResolution = 1.0;
  const mapMinResolution = 2 ** mapMaxZoom * mapMaxResolution;

  const crs = {
    ...CRS.Simple,
    transformation: new Transformation(1, -tileExtent[0], -1, tileExtent[3]),
  };

  crs.scale = (zoom) => 2 ** zoom / mapMinResolution;
  crs.zoom = (scale) => Math.log(scale * mapMinResolution) / Math.LN2;

  return crs;
}
