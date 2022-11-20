import { CRS, Transformation } from "leaflet";
import { IMappableSetting } from "types/map";
import { getMapDimensionsForSetting } from "./index";
import getMapZoomLimitsForSetting from "./getMapZoomLimitsForSetting";

export default function getCRSForSetting(setting: IMappableSetting) {
  const { width: mapWidth, height: mapHeight } =
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
