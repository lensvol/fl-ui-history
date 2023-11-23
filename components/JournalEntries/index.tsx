import { useAppDispatch, useAppSelector } from "features/app/store";
import { fetchSharedContent, fetchSharedContentByUrl } from "features/profile";
import JournalEntry from "components/JournalEntry/JournalEntryContainer";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import NavigationControls from "./NavigationControls";

const qs = require("query-string"); // eslint-disable-line @typescript-eslint/no-var-requires

interface Params {
  profileName: string;
  fromEchoId: string;
}

export default function JournalEntriesContainer() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { search } = useLocation();
  const { profileName, fromEchoId } = useParams<Params>();

  const next = useAppSelector((s) => s.profile.next);
  const prev = useAppSelector((s) => s.profile.prev);
  const sharedContent = useAppSelector((s) => s.profile.sharedContent);

  const [fetchDirection, setFetchDirection] = useState<
    "prev" | "next" | undefined
  >(undefined);
  const [isFetching, setIsFetching] = useState(false);

  const handleFetchDirection = useCallback(
    async (direction: "prev" | "next") => {
      const url = direction === "next" ? next : prev;
      if (!url) {
        return;
      }
      setFetchDirection(direction);
      setIsFetching(true);
      const response = await dispatch(
        fetchSharedContentByUrl({ url })
      ).unwrap();
      setIsFetching(false);
      setFetchDirection(undefined);
      const { shares } = response;
      if (shares.length > 0) {
        history.replace(`/profile/${profileName}/${shares[0].id}`);
      }
    },
    [dispatch, history, next, prev, profileName]
  );

  const handleNext = useCallback(
    () => handleFetchDirection("next"),
    [handleFetchDirection]
  );

  const handlePrev = useCallback(
    () => handleFetchDirection("prev"),
    [handleFetchDirection]
  );

  const handleJumpToDate = useCallback(
    async (value: Date) => {
      const characterName = profileName;
      const date = moment(value).format("YYYY-MM-DD");
      const response = await dispatch(
        fetchSharedContent({ characterName, date })
      ).unwrap();
      const { shares } = response;
      if (shares.length > 0) {
        history.replace(`/profile/${profileName}/${shares[0].id}`);
      }
    },
    [dispatch, history, profileName]
  );

  useEffect(() => {
    // For compatibility, accept either of the following paths:
    // /profile/:profileName/:fromEchoId
    // /profile/:profileName?fromEchoId=xxxxxxx
    const fromId = fromEchoId ?? qs.parse(search)["fromEchoId"]; // eslint-disable-line dot-notation
    dispatch(fetchSharedContent({ fromId, characterName: profileName }));
  }, [dispatch, fromEchoId, profileName, search]);

  return (
    <div className="journal-entries-container">
      <div className="journal-entries__header-and-controls">
        <h1 className="heading heading--1 journal-entries__header">Journal</h1>
        <NavigationControls
          fetchDirection={fetchDirection}
          isFetching={isFetching}
          next={next}
          onJumpToDate={handleJumpToDate}
          onNext={handleNext}
          onPrev={handlePrev}
          prev={prev}
        />
      </div>
      <div className="journal-entries">
        {sharedContent &&
          sharedContent
            .filter((entry) => entry.isFavourite)
            .map((entry) => (
              <JournalEntry
                isFetching={isFetching}
                key={entry.id}
                data={entry}
              />
            ))}
        {sharedContent &&
          sharedContent
            .filter((entry) => !entry.isFavourite)
            .map((entry) => (
              <JournalEntry
                isFetching={isFetching}
                key={entry.id}
                data={entry}
              />
            ))}
      </div>
      <NavigationControls
        fetchDirection={fetchDirection}
        isFetching={isFetching}
        next={next}
        onJumpToDate={handleJumpToDate}
        onNext={handleNext}
        onPrev={handlePrev}
        prev={prev}
      />
    </div>
  );
}

JournalEntriesContainer.displayName = "JournalEntriesContainer";
