import { CRS, Transformation } from "leaflet";

import getIdealMaximumZoomForSetting from "features/mapping/getIdealMaximumZoomForSetting";

import { IMappableSetting } from "types/map";

export default function getCRSForSetting(setting: IMappableSetting) {
  const mapMaxZoom = getIdealMaximumZoomForSetting(setting);

  if (mapMaxZoom === undefined) {
    return undefined;
  }

  const mapMinResolution = 2 ** mapMaxZoom;

  return {
    ...CRS.Simple,
    transformation: new Transformation(1, 0, -1, 0),
    scale: (zoom: number) => 2 ** zoom / mapMinResolution,
    zoom: (scale: number) => Math.log(scale * mapMinResolution) / Math.LN2,
  };
}
