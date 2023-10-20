import { FateCardAction } from "types/fate";

export const CHANGE_FACE: FateCardAction = "FaceChange";
export const CHANGE_NAME: FateCardAction = "AskNameChange";
export const OUTFIT_PURCHASE: FateCardAction = "OutfitPurchase";
export const PURCHASE_CONTENT: FateCardAction = "ContentPurchase";
export const REFILL_OPPORTUNITY_DECK: FateCardAction = "RefillCards";
export const REFILL_SIX_ACTIONS: FateCardAction = "RefillThreeActions"; // ¯\_(ツ)_/¯
export const REFILL_TWENTY_ACTIONS: FateCardAction = "RefillActions";

export const ALL_FATE_CARD_ACTIONS = [
  CHANGE_FACE,
  CHANGE_NAME,
  OUTFIT_PURCHASE,
  PURCHASE_CONTENT,
  REFILL_OPPORTUNITY_DECK,
  REFILL_TWENTY_ACTIONS,
  REFILL_SIX_ACTIONS,
];

export const EXCLUDED_FATE_ACTIONS: FateCardAction[] = [OUTFIT_PURCHASE];
