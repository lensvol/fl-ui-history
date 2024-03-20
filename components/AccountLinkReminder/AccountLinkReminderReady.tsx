import getSortedAuthMethods from "components/AccountLinkReminder/getSortedAuthMethods";
import { STORAGE_KEY_ACCOUNT_LINK_REMINDER_NEVER_NAG } from "constants/accountLinkReminder";
import React, { useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import AuthStatus from "./AuthStatus";

export function AccountLinkReminderReady({
  authMethods,
  onRequestClose,
  twitterAuth,
}: Props) {
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

  const [shouldShowDismissOptions, setShouldShowDismissOptions] =
    useState(!twitterAuth);

  const onAddedSecondAuthMethod = useCallback(() => {
    setShouldShowDismissOptions(true);
  }, [setShouldShowDismissOptions]);

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
        can change this here{!twitterAuth && ", if you'd like"}.
      </p>
      <div>
        <ul style={{ marginLeft: 15 }}>
          {methods.map((method) => (
            <AuthStatus
              method={method}
              onLinkSuccess={onAddedSecondAuthMethod}
            />
          ))}
        </ul>
      </div>
      {shouldShowDismissOptions && (
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
              style={{ marginLeft: ".5rem", marginTop: 0 }}
            />
          </label>
        </div>
      )}
    </div>
  );
}

type OwnProps = {
  onRequestClose: () => void;
};

const mapStateToProps = ({
  settings: {
    authMethods,
    data: { twitterAuth },
  },
}: IAppState) => ({
  authMethods,
  twitterAuth,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(AccountLinkReminderReady);
