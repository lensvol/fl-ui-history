import {
  MAP_BASE_URL,
  MAP_ROOT_AREA_THE_FIFTH_CITY,
  MAP_ROOT_AREA_THE_UNTERZEE,
  MAP_ROOT_AREA_THE_UNTERZEE_V2,
} from "features/mapping/constants";
import { IMappableSetting } from "types/map";

export const SPRITESHEET_SUBFOLDER_NAME_LONDON = "london";
export const SPRITESHEET_SUBFOLDER_NAME_UNTERZEE = "unterzee";
export const SPRITESHEET_SUBFOLDER_NAME_UNTERZEE_V2 = "unterzeev2";

export const SPRITESHEET_SUBFOLDERS_BY_MAP_ROOT_AREA_ID: {
  [areaKey: string]: string;
} = {
  [MAP_ROOT_AREA_THE_FIFTH_CITY]: SPRITESHEET_SUBFOLDER_NAME_LONDON,
  [MAP_ROOT_AREA_THE_UNTERZEE]: SPRITESHEET_SUBFOLDER_NAME_UNTERZEE,
  [MAP_ROOT_AREA_THE_UNTERZEE_V2]: SPRITESHEET_SUBFOLDER_NAME_UNTERZEE_V2,
};

export default function getSpritesheetBaseURL({
  mapRootArea,
}: Pick<IMappableSetting, "mapRootArea">) {
  const subfolder = getSubfolder({ mapRootArea });
  return `${MAP_BASE_URL}/${subfolder}/spritesheets`;
}

function getSubfolder({
  mapRootArea: { areaKey },
}: Pick<IMappableSetting, "mapRootArea">) {
  return SPRITESHEET_SUBFOLDERS_BY_MAP_ROOT_AREA_ID[areaKey];
}
