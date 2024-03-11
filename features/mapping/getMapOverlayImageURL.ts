import { MAP_BASE_URL } from "features/mapping/constants";
import { getPrefixForSetting } from "features/mapping/getSpriteSheetFilenamesForSetting";

import { IMappableSetting } from "types/map";

export default function getMapOverlayImageURL(
  setting: IMappableSetting,
  index: number
) {
  if (!setting.jsonInfo?.hasMapOverlay) {
    return undefined;
  }

  const basePrefix = getPrefixForSetting(setting);

  if (basePrefix === undefined) {
    return undefined;
  }

  const prefix = basePrefix === "unterzeev2" ? "unterzee" : basePrefix;

  return `${MAP_BASE_URL}/${prefix}/background/${prefix}-background-overlay-${index}.png`;
}
