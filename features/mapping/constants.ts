/* eslint-disable quote-props */
import Config from "configuration";

// Normal behaviour is to fetch the current version's spritesheets, but in
// rare cases (e.g. local development) we want to ensure that we fetch the
// latest ones; we make this choice at build time here
export const SPRITESHEET_VERSION = (() => {
  if (process.env.REACT_APP_USE_LATEST_SPRITESHEETS === "true") {
    return "latest";
  }
  return Config.version;
})();

export const MAP_BASE_URL = Config.mapBaseUrl;

export const LODGINGS_AREA_ID = 2;

export const LODGINGS_MARKER_HEIGHT = 54;
export const LODGINGS_MARKER_WIDTH = 60;
export const PLAYER_MARKER_HEIGHT = 159 / 2;
export const PLAYER_MARKER_WIDTH = 112 / 2;

export const ROUTE_LODGINGS_QUALITY_ID = 125023;

export const MAP_ROOT_AREA_THE_FIFTH_CITY = Config.mapRootAreaIDs.london;
export const MAP_ROOT_AREA_THE_UNTERZEE = Config.mapRootAreaIDs.unterzee;
export const MAP_ROOT_AREA_THE_UNTERZEE_V2 = Config.mapRootAreaIDs.unterzeev2;

export const SETTING_ID_ABOARD_AT_PORT = 107951;

export const SPRITESHEET_SUBFOLDER_NAME_LONDON = "london";
export const SPRITESHEET_SUBFOLDER_NAME_UNTERZEE = "unterzee";
export const SPRITESHEET_SUBFOLDER_NAME_UNTERZEE_V2 = "unterzeev2";

export const DEFAULT_CACHED_ZOOM_LEVELS_BY_MAP_ROOT_AREA_ID: {
  [areaKey: string]: number;
} = {
  [MAP_ROOT_AREA_THE_UNTERZEE]: 4.35107444,
  [MAP_ROOT_AREA_THE_UNTERZEE_V2]: 4.35107444,
  [MAP_ROOT_AREA_THE_FIFTH_CITY]: 3,
};

export const IDEAL_MINIMUM_ZOOMS_BY_MAP_ROOT_AREA_ID: {
  [areaKey: string]: number;
} = {
  [MAP_ROOT_AREA_THE_FIFTH_CITY]: 3,
  [MAP_ROOT_AREA_THE_UNTERZEE]: 4.35107444,
  [MAP_ROOT_AREA_THE_UNTERZEE_V2]: 4.35107444,
};

export const MAP_DIMENSIONS_BY_MAP_ROOT_AREA_ID: {
  [areaKey: string]: { height: number; width: number };
} = {
  [MAP_ROOT_AREA_THE_FIFTH_CITY]: { height: 3000, width: 5220 },
  [MAP_ROOT_AREA_THE_UNTERZEE]: { height: 1178, width: 2048 },
  [MAP_ROOT_AREA_THE_UNTERZEE_V2]: { height: 1178, width: 2048 },
};

export const MAXIMUM_ZOOMS_BY_MAP_ROOT_AREA_ID: { [areaKey: string]: number } =
  {
    [MAP_ROOT_AREA_THE_FIFTH_CITY]: 5,
    [MAP_ROOT_AREA_THE_UNTERZEE]: 5,
    [MAP_ROOT_AREA_THE_UNTERZEE_V2]: 5,
  };

export const MINIMUM_ZOOM_LEVEL_FOR_DESTINATIONS_BY_MAP_ROOT_AREA_ID: {
  [areaKey: string]: number;
} = {
  [MAP_ROOT_AREA_THE_FIFTH_CITY]: 3.5,
  [MAP_ROOT_AREA_THE_UNTERZEE]: 4.35107444,
  [MAP_ROOT_AREA_THE_UNTERZEE_V2]: 4.35107444,
};

export const NUMBER_OF_SPRITESHEETS_BY_MAP_ROOT_AREA_ID: {
  [areaKey: string]: number;
} = {
  [MAP_ROOT_AREA_THE_FIFTH_CITY]: 5,
  [MAP_ROOT_AREA_THE_UNTERZEE]: 2,
  [MAP_ROOT_AREA_THE_UNTERZEE_V2]: 2,
};

export const SPRITESHEET_PREFIXES_BY_MAP_ROOT_AREA_ID = {
  [MAP_ROOT_AREA_THE_FIFTH_CITY]: "london",
  [MAP_ROOT_AREA_THE_UNTERZEE]: "unterzee",
  [MAP_ROOT_AREA_THE_UNTERZEE_V2]: "unterzeev2",
};

export const SPRITESHEET_SUBFOLDERS_BY_MAP_ROOT_AREA_ID: {
  [areaKey: string]: string;
} = {
  [MAP_ROOT_AREA_THE_FIFTH_CITY]: SPRITESHEET_SUBFOLDER_NAME_LONDON,
  [MAP_ROOT_AREA_THE_UNTERZEE]: SPRITESHEET_SUBFOLDER_NAME_UNTERZEE,
  [MAP_ROOT_AREA_THE_UNTERZEE_V2]: SPRITESHEET_SUBFOLDER_NAME_UNTERZEE_V2,
};

export const SPRITE_REGEX = /([^-]*)-(.*)\.png/;

export const SELECTION_SPRITE_SUFFIXES = [
  "selection",
  "main-destination-selection",
];

export const SPRITE_TYPE_ORDERING = {
  fog: -4,
  coastlinesea: -3,
  coastline: -2,
  sea: -1,
  available: 0,
  "main-destination": 1,
  selection: 2,
  "main-destination-selection": 3,
};
