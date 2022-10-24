import { OutfitSlotName, OutfitType } from "types/outfit";

export const OUTFIT_TYPE_EXCEPTIONAL: OutfitType = "Exceptional";
export const OUTFIT_TYPE_GIVEN_IN_GAME: OutfitType = "GivenInGame";
export const OUTFIT_TYPE_PURCHASED: OutfitType = "Purchased";
export const OUTFIT_TYPE_STANDARD: OutfitType = "Standard";

export const OUTFIT_TYPE_ORDERING: { [key in OutfitType]: number } = {
  Standard: 0,
  Purchased: 1,
  GivenInGame: 2,
  Exceptional: 3,
};

export const OUTFIT_TYPES = [
  OUTFIT_TYPE_STANDARD,
  OUTFIT_TYPE_PURCHASED,
  OUTFIT_TYPE_GIVEN_IN_GAME,
  OUTFIT_TYPE_EXCEPTIONAL,
].sort((a, b) => OUTFIT_TYPE_ORDERING[a] - OUTFIT_TYPE_ORDERING[b]);

export const HUMAN_READABLE_OUTFIT_NAMES: { [key in OutfitType]: string } = {
  Exceptional: "Exceptional", // eslint-disable-line quote-props
  GivenInGame: "Given in game", // eslint-disable-line quote-props
  Purchased: "Purchased", // eslint-disable-line quote-props
  Standard: "Standard", // eslint-disable-line quote-props
};

export const CHANGEABLE_CATEGORIES: OutfitSlotName[] = [
  "Treasure",
  "Hat",
  "Clothing",
  "Gloves",
  "Weapon",
  "Boots",
  "Companion",
  "Affiliation",
  "Transportation",
  // 'Home Comfort',
  "HomeComfort",
];

const STANDARD_CATEGORIES: OutfitSlotName[] = [
  "Burden",
  "TestSlot2",
  "Hat",
  "Clothing",
  "Gloves",
  "Weapon",
  "Boots",
  "Companion",
  "Treasure",
  "Destiny",
  "TestSlot4",
];

const EXPANDED_CATEGORIES: OutfitSlotName[] = [
  "Affiliation",
  "Transportation",
  "HomeComfort",
  "Ship",
  "Spouse",
  "Club",
];

export const OUTFIT_CATEGORIES = [
  ...STANDARD_CATEGORIES,
  ...EXPANDED_CATEGORIES,
];

export const MESSAGE_LAPSED_EXCEPTIONAL_OUTFIT =
  "You cannot put this outfit on unless you are an Exceptional Friend.";
