import { OutfitType } from "types/outfit";

export const OUTFIT_TYPE_ENHANCED_EXCEPTIONAL: OutfitType =
  "EnhancedExceptional";
export const OUTFIT_TYPE_EXCEPTIONAL: OutfitType = "Exceptional";
const OUTFIT_TYPE_GIVEN_IN_GAME: OutfitType = "GivenInGame";
const OUTFIT_TYPE_PURCHASED: OutfitType = "Purchased";
const OUTFIT_TYPE_STANDARD: OutfitType = "Standard";

export const OUTFIT_TYPE_ORDERING: { [key in OutfitType]: number } = {
  Standard: 0,
  Purchased: 1,
  GivenInGame: 2,
  Exceptional: 3,
  EnhancedExceptional: 4,
};

export const OUTFIT_TYPES = [
  OUTFIT_TYPE_STANDARD,
  OUTFIT_TYPE_PURCHASED,
  OUTFIT_TYPE_GIVEN_IN_GAME,
  OUTFIT_TYPE_EXCEPTIONAL,
  OUTFIT_TYPE_ENHANCED_EXCEPTIONAL,
].sort((a, b) => OUTFIT_TYPE_ORDERING[a] - OUTFIT_TYPE_ORDERING[b]);

export const HUMAN_READABLE_OUTFIT_NAMES: { [key in OutfitType]: string } = {
  EnhancedExceptional: "Enhanced Exceptional", // eslint-disable-line quote-props
  Exceptional: "Exceptional", // eslint-disable-line quote-props
  GivenInGame: "Given in game", // eslint-disable-line quote-props
  Purchased: "Purchased", // eslint-disable-line quote-props
  Standard: "Standard", // eslint-disable-line quote-props
};

export const MESSAGE_LAPSED_ENHANCED_EXCEPTIONAL_OUTFIT =
  "You cannot put this outfit on unless you are an Enhanced Exceptional Friend.";
export const MESSAGE_LAPSED_EXCEPTIONAL_OUTFIT =
  "You cannot put this outfit on unless you are an Exceptional Friend.";
