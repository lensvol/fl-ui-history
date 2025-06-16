import React, { useCallback, useMemo, useState } from "react";

import AuthStatus from "components/AccountLinkReminder/AuthStatus";
import getSortedAuthMethods from "components/AccountLinkReminder/getSortedAuthMethods";

import { STORAGE_KEY_ACCOUNT_LINK_REMINDER_NEVER_NAG } from "constants/accountLinkReminder";

import { useAppSelector } from "features/app/store";

export default function AccountLinkReminderReady({ onRequestClose }: Props) {
  const authMethods = useAppSelector((state) => state.settings.authMethods);

  const methods = useMemo(
    () => getSortedAuthMethods(authMethods ?? []),
    [authMethods]
  );

  const [isChecked, setIsChecked] = useState<boolean>(
    JSON.parse(
      localStorage.getItem(STORAGE_KEY_ACCOUNT_LINK_REMINDER_NEVER_NAG) ??
        "false"
    )
  );

  const onChange = useCallback((e) => {
    setIsChecked(e.target.checked);

    if (e.target.checked) {
      localStorage.setItem(STORAGE_KEY_ACCOUNT_LINK_REMINDER_NEVER_NAG, "true");
    } else {
      localStorage.removeItem(STORAGE_KEY_ACCOUNT_LINK_REMINDER_NEVER_NAG);
    }
  }, []);

  return (
    <div>
      <h2 className="heading heading--2">Review your login methods</h2>
      <p>
        It looks like you've only linked your account to one login method. You
        can change this here, if you'd like.
      </p>
      <div>
        <ul
          style={{
            marginLeft: "15px",
          }}
        >
          {methods.map((method) => (
            <AuthStatus method={method} />
          ))}
        </ul>
      </div>
      <div className="buttons account-link-reminder__buttons">
        <button
          className="button button--primary"
          type="button"
          onClick={onRequestClose}
        >
          Close
        </button>
        <label htmlFor="dont-ask-again">
          Don't remind me about this again on this device
          <input
            id="dont-ask-again"
            type="checkbox"
            onChange={onChange}
            checked={isChecked}
            style={{
              marginLeft: "0.5rem",
              marginTop: 0,
            }}
          />
        </label>
      </div>
    </div>
  );
}

AccountLinkReminderReady.displayName = "AccountLinkReminderReady";

type Props = {
  onRequestClose: () => void;
};
