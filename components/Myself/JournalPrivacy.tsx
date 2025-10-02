import React, { ChangeEvent, useCallback } from "react";

import { useDispatch } from "react-redux";

import { setJournalPrivacy } from "actions/myself";

import { useAppSelector } from "features/app/store";

export default function JournalPrivacy() {
  const dispatch = useDispatch();

  const journalIsPrivate = useAppSelector(
    (state) => state.myself.character.journalIsPrivate
  );

  const onChangeJournalPrivacy = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { checked } = e.target;

      dispatch(setJournalPrivacy(checked));
    },
    [dispatch]
  );

  return (
    <div className="myself-profile-privacy">
      <input
        id="hideProfile"
        name="hideProfile"
        type="checkbox"
        checked={journalIsPrivate}
        onChange={onChangeJournalPrivacy}
      />{" "}
      <label htmlFor="hideProfile">Private profile</label>
    </div>
  );
}

JournalPrivacy.displayName = "JournalPrivacy";
