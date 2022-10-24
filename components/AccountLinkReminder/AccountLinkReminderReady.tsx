import getSortedAuthMethods from "components/AccountLinkReminder/getSortedAuthMethods";
import { STORAGE_KEY_ACCOUNT_LINK_REMINDER_NEVER_NAG } from "constants/accountLinkReminder";
import React, { useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import AuthStatus from "./AuthStatus";

export function AccountLinkReminderReady({
  authMethods,
  onRequestClose,
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
        <ul>
          {methods.map((method) => (
            <li key={method}>
              <h3 className="heading heading--3">{method}</h3>
              <AuthStatus method={method} />
            </li>
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
            type="checkbox"
            onChange={onChange}
            checked={isChecked}
            style={{ marginLeft: ".5rem", marginTop: 0 }}
          />
        </label>
      </div>
    </div>
  );
}

type OwnProps = {
  onRequestClose: () => void;
};

const mapStateToProps = ({ settings: { authMethods } }: IAppState) => ({
  authMethods,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(AccountLinkReminderReady);
