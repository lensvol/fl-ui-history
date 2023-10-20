import { createContext } from "react";

export type TabType =
  | "Profile"
  | "Authentication"
  | "Notifications"
  | "Contacts"
  | "Subscription"
  | "Preferences"
  | "Deletion";

export const TAB_TYPE_USER: TabType = "Profile";
export const TAB_TYPE_AUTH: TabType = "Authentication";
export const TAB_TYPE_MESSAGING: TabType = "Notifications";
export const TAB_TYPE_SUBSCRIPTION: TabType = "Subscription";
export const TAB_TYPE_PREFERENCES: TabType = "Preferences";
export const TAB_TYPE_CONTACTS: TabType = "Contacts";
export const TAB_TYPE_DANGER_ZONE: TabType = "Deletion";

export interface AccountContextValue {
  currentTab: TabType;
  setCurrentTab: (tabType: TabType) => void;
}

const AccountContext = createContext<AccountContextValue>({
  currentTab: TAB_TYPE_USER,
  setCurrentTab: (_) => {
    /* no-op */
  },
});
AccountContext.displayName = "AccountContext";

export default AccountContext;
