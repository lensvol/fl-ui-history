import React, { useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";

import { logoutUser } from "actions/user";
import RequestPasswordResetModal from "components/RequestPasswordResetModal";
import { IAppState } from "types/app";
import ChangeUsernameModal from "../ChangeUsernameModal";
import MetaQualities from "../MetaQualities";

import { fetchTimeTheHealer } from "features/timeTheHealer/timeTheHealerSlice";

export function UserProfile({
  dispatch,
  loggedIn,
  timeTheHealer,
  user,
}: Props) {
  const { dateTimeToExecute } = timeTheHealer;
  const createdAt = user.user?.createdAt;

  const createdAtString: null | string = useMemo(() => {
    if (!createdAt) {
      return null;
    }

    const formatter = Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formatter.format(new Date(createdAt));
  }, [createdAt]);

  const userName = user.user?.name;

  const [isChangeUsernameModalOpen, setIsChangeUsernameModalOpen] =
    useState(false);
  const [isPasswordResetRequestModalOpen, setIsPasswordResetRequestModalOpen] =
    useState(false);

  const onLogout = useCallback(async () => {
    await dispatch(logoutUser());
  }, [dispatch]);

  const handleRequestCloseChangeUsernameModal = useCallback(
    () => setIsChangeUsernameModalOpen(false),
    []
  );
  const handleRequestClosePasswordResetRequestModal = useCallback(
    () => setIsPasswordResetRequestModalOpen(false),
    []
  );

  const onSummonChangeUsernameModal = useCallback(() => {
    setIsChangeUsernameModalOpen(true);
  }, []);

  const onSummonPasswordResetRequestModal = useCallback(() => {
    setIsPasswordResetRequestModalOpen(true);
  }, []);

  useEffect(() => {
    if (loggedIn) {
      dispatch(fetchTimeTheHealer());
    }
  }, [dispatch, loggedIn]);

  return (
    <>
      <section>
        <h2 className="heading heading--2">User profile</h2>
        <p>
          Username: {userName} (
          <button
            className="button--link"
            onClick={onSummonChangeUsernameModal}
            type="button"
          >
            edit
          </button>
          )
        </p>

        {createdAtString && <p>A Fallen Londoner since {createdAtString}</p>}

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
        </ul>

        {dateTimeToExecute && (
          <>
            <h2 className="heading heading--2">Time, the Healer</h2>
            <p>Your next visit from Time, the Healer should occur on:</p>
            <p>{new Date(dateTimeToExecute).toString()}</p>
          </>
        )}

        <MetaQualities />
      </section>

      <ChangeUsernameModal
        isOpen={isChangeUsernameModalOpen}
        onRequestClose={handleRequestCloseChangeUsernameModal}
      />

      <RequestPasswordResetModal
        isOpen={isPasswordResetRequestModalOpen}
        onRequestClose={handleRequestClosePasswordResetRequestModal}
      />
    </>
  );
}

const mapStateToProps = ({ timeTheHealer, user }: IAppState) => ({
  loggedIn: user.loggedIn,
  timeTheHealer,
  user,
});

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: ThunkDispatch<any, any, any>;
};

export default connect(mapStateToProps)(UserProfile);
