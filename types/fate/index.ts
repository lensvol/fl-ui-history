export type FateData = {
  actionRefillFateCard: MultipleChoiceActionRefillFateCard | undefined;
  enhancedActionRefreshCard?: MultipleChoiceEnhancedActionRefreshCard;
  currentFate: number;
  fateCards: IFateCard[];
  premiumSubPurchaseCard?: IFateCard;
};

export interface IFateCard {
  action: FateCardAction;
  author: string;
  border: string;
  canAfford: boolean;
  description: string;
  factions: string | undefined;
  fanFavourite: boolean;
  hidden?: boolean; // Not part of the current API model
  id: number;
  image: string;
  name: string;
  price: number;
  releaseDate: string;
  season?: string | undefined;
  shortDescription: string;
  type: FateCardType;
  enhancedStoryAvailability?: EnhancedStoryAvailability;
  enhancedFeaturedItem?: boolean;
}

export type MultipleChoiceActionRefillFateCard = Omit<
  Partial<IFateCard>,
  "price"
> & {
  price: number[];
  buttons: {
    correspondingActivePurchase: IFateCard | undefined;
    description: string;
  }[];
};

export type MultipleChoiceEnhancedActionRefreshCard = Omit<
  Partial<IFateCard>,
  "action"
> & {
  action: FateCardAction;
  buttons: {
    correspondingActivePurchase?: IFateCard;
    description: string;
  }[];
  remainingActionRefreshes?: number;
  remainingStoryUnlocks?: number;
};

export enum ExceptionalFriendWizardStep {
  Loading,
  Blurb,
  Payment,
  Success,
  Error,
}

export type FateCardAction =
  | "FaceChange"
  | "AskNameChange"
  | "OutfitPurchase"
  | "ContentPurchase"
  | "RefillCards"
  | "RefillThreeActions"
  | "EnhancedRefresh"
  | "EnhancedUnlock"
  | "RefillActions";

export type FateCardType =
  | "Digital"
  | "Interactive"
  | "Subscription"
  | "PurchaseStory"
  | "ResetStory"
  | "AmbitionReset";

export type EnhancedStoryAvailability = "None" | "FreshlyAdded" | "FinalMonth";

export type FateSubtab = "gameplay" | "new" | "reset";
export const SUBTAB_GAMEPLAY: FateSubtab = "gameplay";
export const SUBTAB_NEW: FateSubtab = "new";
export const SUBTAB_RESET = "reset";
