import Config from "configuration";

export const DUMMY_XY_COORDINATES = {
  x: Number.MIN_SAFE_INTEGER,
  y: Number.MAX_SAFE_INTEGER,
};

// Normal behaviour is to fetch the current version's spritesheets, but in
// rare cases (e.g. local development) we want to ensure that we fetch the
// latest ones; we make this choice at build time here
const SPRITESHEET_VERSION = (() => {
  if (process.env.REACT_APP_USE_LATEST_SPRITESHEETS === "true") {
    return "latest";
  }
  return Config.version;
})();

export const MAP_BASE_URL = Config.mapBaseUrl;

export const MAP_MIN_ZOOM = 3;
export const MAP_MAX_ZOOM = 5;

export const MIN_ZOOM_LEVEL_FOR_DESTINATIONS = 3.5;
export const MIN_ZOOM_LEVEL_FOR_LANDMARKS = 4;

export const LODGINGS_AREA_ID = 2;

export const LODGINGS_MARKER_HEIGHT = 54;
export const LODGINGS_MARKER_WIDTH = 60;
export const PLAYER_MARKER_HEIGHT = 159 / 2;
export const PLAYER_MARKER_WIDTH = 112 / 2;

export const ROUTE_LODGINGS_QUALITY_ID = 125023;

export const MAP_HEIGHT = 3000;
export const MAP_WIDTH = 5220;

export const NUMBER_OF_SPRITE_SHEETS = 5;
export const SPRITE_SHEET_BASE_URL = `${MAP_BASE_URL}/spritesheets/${SPRITESHEET_VERSION}/london`;
// export const SPRITE_SHEET_BASE_URL = `/img/spritesheets`;
export const SPRITE_REGEX = /([^-]*)-(.*)\.png/;

export const SELECTION_SPRITE_SUFFIXES = [
  "selection",
  "main-destination-selection",
];

export const SPRITE_TYPE_ORDERING = {
  available: 0,
  "main-destination": 1,
  selection: 2,
  "main-destination-selection": 3,
};

const spriteSheetFileNames: string[] = [];
for (let i = 0; i < NUMBER_OF_SPRITE_SHEETS; i++) {
  spriteSheetFileNames.push(`${SPRITE_SHEET_BASE_URL}/london-${i}.json`);
}

export const SPRITE_SHEET_FILE_NAMES = spriteSheetFileNames;
