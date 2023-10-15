import { useAppDispatch, useAppSelector } from "features/app/store";
import React, { useCallback, useMemo } from "react";

import { addContact, deleteContact } from "features/contacts";
import classnames from "classnames";

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

  const handleClick = useCallback(() => {
    if (!profileCharacter) {
      return;
    }

    if (addedContact) {
      dispatch(deleteContact({ userID: addedContact.id }));
    } else {
      dispatch(addContact({ userName: profileCharacter.name }));
    }
  }, [addedContact, dispatch, profileCharacter]);

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
    <button
      className="button button--primary profile__inventory-switcher"
      onClick={handleClick}
      type="button"
    >
      <span className={classnames("fa", "fa-user", "heading--1")}></span>
      <span
        className={classnames("fa", addedContact ? "fa-minus" : "fa-plus")}
      ></span>
    </button>
  );
}

AddToContacts.displayName = "AddToContacts";
