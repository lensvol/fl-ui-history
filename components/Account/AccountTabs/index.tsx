import React from "react";
import classnames from "classnames";
import AccountContext, {
  TAB_TYPE_AUTH,
  TAB_TYPE_CONTACTS,
  TAB_TYPE_DANGER_ZONE,
  TAB_TYPE_NOTIFICATIONS,
  TAB_TYPE_PREFERENCES,
  TAB_TYPE_SUBSCRIPTION,
  TAB_TYPE_USER,
  TabType,
} from "../AccountContext";

export default function AccountTabs() {
  return (
    <ul role="tablist" aria-label="Account sections" className="nav__list">
      <AccountTab label="Profile" tabType={TAB_TYPE_USER} />
      <AccountTab tabType={TAB_TYPE_PREFERENCES} label="Preferences" />
      <AccountTab label="Authentication" tabType={TAB_TYPE_AUTH} />
      <AccountTab tabType={TAB_TYPE_SUBSCRIPTION} label="Subscription" />
      <AccountTab tabType={TAB_TYPE_NOTIFICATIONS} label="Notifications" />
      <AccountTab tabType={TAB_TYPE_CONTACTS} label="Contacts" />
      <AccountTab tabType={TAB_TYPE_DANGER_ZONE} label="Deletion" dangerous />
    </ul>
  );
}

function AccountTab({ dangerous, label, tabType }: AccountTabProps) {
  return (
    <AccountContext.Consumer>
      {({ currentTab, setCurrentTab }) => {
        const isActive = currentTab === tabType;
        return (
          <li className="nav__item">
            <button
              role="tab"
              type="button"
              aria-selected={isActive}
              id={`tab--${tabType}`}
              onClick={() => setCurrentTab(tabType)}
              className={classnames(
                "button--link nav__button",
                isActive && "menu-item--active",
                dangerous && "button--link-dangerous"
              )}
            >
              {label}
            </button>
          </li>
        );
      }}
    </AccountContext.Consumer>
  );
}

type AccountTabProps = {
  dangerous?: boolean;
  tabType: TabType;
  label: string;
};
