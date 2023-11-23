import { useAppDispatch, useAppSelector } from "features/app/store";
import React, { useCallback, useMemo, useState } from "react";

import { addContact, deleteContact } from "features/contacts";
import classnames from "classnames";
import useIsMounted from "hooks/useIsMounted";
import wait from "utils/wait";

export default function AddToContacts() {
  const dispatch = useAppDispatch();

  const contacts = useAppSelector((s) => s.contacts.contacts);
  const isLoggedInUsersProfile = useAppSelector(
    (s) => s.profile.isLoggedInUsersProfile
  );
  const loggedIn = useAppSelector((s) => s.user.loggedIn);
  const profileCharacter = useAppSelector((s) => s.profile.profileCharacter);
  const addedContact = contacts.find(
    ({ userName }) => userName === profileCharacter?.userName
  );

  const isMounted = useIsMounted();
  const [alertMessage, setAlertMessage] = useState<string | undefined>();
  const [isHidingAlertMessage, setIsHidingAlertMessage] = useState(false);

  const showAlertMessage = useCallback(
    async (message?: string) => {
      setAlertMessage(message);
      setIsHidingAlertMessage(false);

      if (!isMounted.current) {
        return;
      }

      await wait(1000);

      if (!isMounted.current) {
        return;
      }

      setIsHidingAlertMessage(true);

      await wait(500);
    },
    [isMounted]
  );

  const handleClick = useCallback(() => {
    if (!profileCharacter) {
      return;
    }

    if (addedContact) {
      dispatch(deleteContact({ userID: addedContact.id }));

      showAlertMessage("Removed from contacts!");
    } else {
      dispatch(addContact({ userName: profileCharacter.name }));

      showAlertMessage("Added to contacts!");
    }
  }, [addedContact, dispatch, profileCharacter, showAlertMessage]);

  const canBeAdded = useMemo(() => {
    if (!profileCharacter) {
      return false;
    }

    if (!loggedIn) {
      return false;
    }

    return !isLoggedInUsersProfile;
  }, [isLoggedInUsersProfile, loggedIn, profileCharacter]);

  if (!canBeAdded) {
    return null;
  }

  return (
    <span className="profile__contacts-container">
      <div
        className="profile__contacts-alert"
        style={{
          visibility: isHidingAlertMessage ? "hidden" : "visible",
        }}
      >
        {alertMessage}
      </div>
      <button
        className="button button--primary profile__inventory-switcher"
        onClick={handleClick}
        type="button"
      >
        <span className={classnames("fa", "fa-user", "heading--2")}></span>
        <span
          className={classnames("fa", addedContact ? "fa-minus" : "fa-plus")}
        ></span>
      </button>
    </span>
  );
}

AddToContacts.displayName = "AddToContacts";
