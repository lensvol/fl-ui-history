import React, { useCallback } from "react";

import { useDispatch } from "react-redux";

import { toggleJournalView } from "actions/myself";

export default function OpenJournal() {
  const dispatch = useDispatch();

  const handleClickToggle = useCallback(async () => {
    dispatch(toggleJournalView());
  }, [dispatch]);

  return (
    <span
      className="button button--primary button--no-margin"
      onClick={handleClickToggle}
    >
      Open Journal
    </span>
  );
}

OpenJournal.displayName = "OpenJournal";
