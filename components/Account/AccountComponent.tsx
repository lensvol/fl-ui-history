import Subscription from "components/Account/Sections/Subscription";
import React, { useEffect, useMemo, useState } from "react";

import AccountContext, {
  TAB_TYPE_AUTH,
  TAB_TYPE_CONTACTS,
  TAB_TYPE_DANGER_ZONE,
  TAB_TYPE_NOTIFICATIONS,
  TAB_TYPE_PREFERENCES,
  TAB_TYPE_SUBSCRIPTION,
  TAB_TYPE_USER,
  TabType,
} from "./AccountContext";

import AccountTabs from "./AccountTabs";

import Authentication from "./Sections/Authentication";
import ContactsSection from "./Sections/Contacts";
import Deletion from "./Sections/Deletion";
import Messaging from "./Sections/Messaging";
import Preferences from "./Sections/Preferences";
import UserProfile from "./Sections/UserProfile";

type Props = {
  hash?: string;
};

export default function Account(props: Props) {
  const { hash } = props;

  const [currentTab, setCurrentTab] = useState<TabType>(TAB_TYPE_USER);

  useEffect(() => {
    if (hash) {
      setCurrentTab(hash.replace("#", "") as TabType);
    }
  }, [hash, setCurrentTab]);

  const tabContent = useMemo(() => {
    switch (currentTab) {
      case TAB_TYPE_AUTH:
        return <Authentication />;
      case TAB_TYPE_NOTIFICATIONS:
        return <Messaging />;
      case TAB_TYPE_SUBSCRIPTION:
        return <Subscription />;
      case TAB_TYPE_PREFERENCES:
        return <Preferences />;
      case TAB_TYPE_CONTACTS:
        return <ContactsSection />;
      case TAB_TYPE_DANGER_ZONE:
        return <Deletion />;
      case TAB_TYPE_USER:
      default:
        return <UserProfile />;
    }
  }, [currentTab]);

  return (
    <div className="content container">
      <div className="account">
        <AccountContext.Provider value={{ currentTab, setCurrentTab }}>
          <h1 className="heading heading--1">Account</h1>
          <div className="nav nav--stacked nav--stacked--1-of-4 nav--stacked--roman">
            <AccountTabs />
          </div>

          <div className="stack-content">
            <div role="tabpanel" aria-labelledby={`tab--${currentTab}`}>
              {tabContent}
            </div>
          </div>
        </AccountContext.Provider>
      </div>
    </div>
  );
}

Account.displayName = "Account";
