import Config from "configuration";

export const FEATURE_SHOW_VAT_BREAKDOWN = "feature/show-vat-breakdown";

export const FEATURE_FLAGS: {
  [key: string]: boolean;
} = {
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
