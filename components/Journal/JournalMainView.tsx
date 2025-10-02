import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import fetchJournalPage from "actions/journal/fetchJournalPage";
import fetchJournalTags from "actions/journal/fetchJournalTags";

import EditJournalControls from "components/Journal/EditJournalControls";
import JournalEntryView from "components/Journal/JournalEntryView";
import JournalNavigationControls from "components/Journal/JournalNavigationControls";
import Loading from "components/Loading";

import { useAppSelector } from "features/app/store";

export default function JournalMainView() {
  const dispatch = useDispatch();

  const page = useAppSelector((state) => state.journal.page);
  const sortBy = useAppSelector((state) => state.journal.sortBy);
  const filterBy = useAppSelector((state) => state.journal.filterBy);
  const entries = useAppSelector((state) => state.journal.entries);

  const [didLoad, setDidLoad] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (didLoad) {
      return;
    }

    asyncUseEffect();

    async function asyncUseEffect() {
      await dispatch(fetchJournalTags());
      await dispatch(
        fetchJournalPage({
          filterBy,
          page,
          sortBy,
        })
      );

      setDidLoad(true);
    }
  }, [didLoad, dispatch, filterBy, page, sortBy]);

  return (
    <>
      <EditJournalControls
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
      />

      <JournalNavigationControls
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
      />

      <div className="journal-entries">
        {isUpdating || entries === undefined ? (
          <Loading spinner />
        ) : entries.length === 0 ? (
          <div className="journal-empty">No journal entries found.</div>
        ) : (
          entries.map((entry) => (
            <JournalEntryView
              key={entry.id}
              isUpdating={isUpdating}
              entry={entry}
            />
          ))
        )}
      </div>

      <JournalNavigationControls
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
      />
    </>
  );
}

JournalMainView.displayName = "JournalMainView";
