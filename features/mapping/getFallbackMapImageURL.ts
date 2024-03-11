import { MAP_BASE_URL } from "features/mapping/constants";
import { getPrefixForSetting } from "features/mapping/getSpriteSheetFilenamesForSetting";

import { IMappableSetting } from "types/map";

export default function getFallbackMapImageURL(setting: IMappableSetting) {
  const basePrefix = getPrefixForSetting(setting);

  if (basePrefix === undefined || basePrefix === "london") {
    return `${MAP_BASE_URL}/london/fallback/london-fallback.jpg`;
  }

  const prefix = basePrefix === "unterzeev2" ? "unterzee" : basePrefix;

  return `${MAP_BASE_URL}/${prefix}/background/${prefix}-background.jpg`;
}
