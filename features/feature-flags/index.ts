import Config from "configuration";

export const FILTER_ENHANCEMENTS = "filter-enhancements";
export const NEW_OUTFIT_BEHAVIOUR = "new-outfit-behaviour";
export const OPTIMIZE_MYSELF_QUALITIES = "optimize-myself-qualities";
export const SHOW_EQUIPMENT_SEARCH = "show-equipment-search";

export const FEATURE_ACCOUNT_LINK_REMINDER = "feature/account-link-reminder";
export const FEATURE_CREDITS = "feature/credits";
export const FEATURE_DOES_STORYLET_STATE_LOCK_OUTFITS =
  "feature/does-storylet-state-lock-outfits";
export const FEATURE_PERSISTENT_DECK = "feature/persistent-deck";
export const FEATURE_POSSESSIONS_TAB_AVATAR = "feature/possessions-tab-avatar";
export const FEATURE_SHOW_VAT_BREAKDOWN = "feature/show-vat-breakdown";

export const FEATURE_FLAGS: {
  [key: string]: boolean;
} = {
  [FILTER_ENHANCEMENTS]: true,
  [NEW_OUTFIT_BEHAVIOUR]: true,
  [OPTIMIZE_MYSELF_QUALITIES]: true,
  [SHOW_EQUIPMENT_SEARCH]: true,
  [FEATURE_ACCOUNT_LINK_REMINDER]: true,
  [FEATURE_CREDITS]: true,
  [FEATURE_DOES_STORYLET_STATE_LOCK_OUTFITS]: true,
  [FEATURE_PERSISTENT_DECK]: true,
  [FEATURE_POSSESSIONS_TAB_AVATAR]: true,
  [FEATURE_SHOW_VAT_BREAKDOWN]: false,
};

export const DEBUG_ALWAYS_SHOW_ACCOUNT_LINK_REMINDER =
  "debug/always-show-account-link-reminder";

const DEBUG_FLAG_SETTINGS: {
  [key: string]: boolean;
} = {
  [DEBUG_ALWAYS_SHOW_ACCOUNT_LINK_REMINDER]: true,
};

// Safe debug flags --- won't be switched on in prod
export const DEBUG_FLAGS = Object.keys(DEBUG_FLAG_SETTINGS).reduce(
  (acc, next) => ({
    ...acc,
    [next]:
      DEBUG_FLAG_SETTINGS[next] &&
      (Config.environment === "staging" || Config.environment === "local"),
  }),
  {} as {
    [key: string]: boolean;
  }
);
