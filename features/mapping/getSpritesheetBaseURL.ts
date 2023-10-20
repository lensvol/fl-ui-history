import {
  MAP_BASE_URL,
  SPRITESHEET_SUBFOLDERS_BY_MAP_ROOT_AREA_ID,
  SPRITESHEET_VERSION,
} from "features/mapping/constants";
import { IMappableSetting } from "types/map";

export default function getSpritesheetBaseURL({
  mapRootArea,
}: Pick<IMappableSetting, "mapRootArea">) {
  const subfolder = getSubfolder({ mapRootArea });
  return `${MAP_BASE_URL}/spritesheets/${SPRITESHEET_VERSION}/${subfolder}`;
}

function getSubfolder({
  mapRootArea: { areaKey },
}: Pick<IMappableSetting, "mapRootArea">) {
  return SPRITESHEET_SUBFOLDERS_BY_MAP_ROOT_AREA_ID[areaKey];
}
