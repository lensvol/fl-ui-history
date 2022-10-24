import Subscription from "components/Account/Sections/Subscription";
import React, { useEffect, useMemo, useState } from "react";

import AccountContext, {
  TAB_TYPE_AUTH,
  TAB_TYPE_CONTACTS,
  TAB_TYPE_DANGER_ZONE,
  TAB_TYPE_MESSAGING,
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

type OwnProps = {
  hash?: string;
};

export function Account(props: Props) {
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
      case TAB_TYPE_MESSAGING:
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
        {/*

      <div className="account" style={{ margin: 10 }}>
        <h1 className="heading heading--1" style={{ marginTop: 5 }}>
          <GoBackButton />
          Account settings
        </h1>

        <MediaMdDown>
          <hr />
        </MediaMdDown>

        <ReactCSSTransitionReplace transitionName="fade-wait" transitionEnterTimeout={100} transitionLeaveTimeout={100}>
          {message ? (
            <div key="message" style={{ paddingBottom: 24 }}>
              <p style={{ padding: 12, background: '#3f7277', color: '#fff' }}>
                {message}
              </p>
            </div>
          ) : <p key="none" />}
        </ReactCSSTransitionReplace>

        <div className="account__body">
          <div className="account__left">
            <section>
              <h2 className="heading heading--2">User profile</h2>
              <p>
                Username:
                {' '}
                {name}
                {' '}
                (
                <button
                  className="button--link"
                  onClick={onSummonChangeUsernameModal}
                  type="button"
                >
                  edit
                </button>
                )
              </p>
              <ul className="list--padded">
                <li>
                  <button
                    className="button button--primary"
                    onClick={onLogout}
                    type="button"
                  >
                    Log out
                  </button>
                </li>
                <li>
                  <button
                    className="button button--primary"
                    onClick={onSummonPasswordResetRequestModal}
                    type="button"
                  >
                    Reset password
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="button button--dangerous"
                    onClick={onSummonDeactivateAccountModal}
                  >
                    Deactivate Account
                  </button>
                  <Buttonlet
                    type="question"
                    // eslint-disable-next-line max-len
                    // title={'This will permanently remove your user account and all characters'
                    + ' IN ALL STORYNEXUS WORLDS attached to it.'
                    + ' Please note: deactivation does not cancel mobile Exceptional Friendship.
                    + ' To do that, please access your device's Google/Apple account settings.'}
                  />
                </li>
              </ul>
            </section>

            <hr />

            <AuthMethods />
            <hr />
            <MessagePreferences />
            <hr />
            <MessageMethod />
            <hr />
            <MetaQualities />
            <hr />
            <MapSettings />
          </div>
          <div className="account__right">
            <MediaMdDown>
              <hr />
            </MediaMdDown>
            <Subscriptions />
            <hr />
            <h2 className="heading heading--2">Blocked Users</h2>
            <p>
              Receiving abusive messages via Fallen London? Report the troublemaker at
              {' '}
              <a href="mailto:abuse@failbettergames.com">abuse@failbettergames.com</a>
              .
            </p>
            <hr />
            {loggedIn && <Contacts />}
          </div>
        </div>
      </div>

      */}
      </div>
    </div>
  );
}

Account.displayName = "Account";

type Props = OwnProps;

export default Account;
