import React, { useCallback, useEffect, useState } from "react";

import { useLocation, useParams } from "react-router-dom";

import moment from "moment";

import fetchJournalFavorite from "actions/journal/fetchJournalFavorites";
import fetchJournalPage from "actions/journal/fetchJournalPage";

import NavigationControls from "components/JournalEntries/NavigationControls";
import JournalEntry from "components/JournalEntry/JournalEntryContainer";
import Modal from "components/Modal";

import { useAppDispatch, useAppSelector } from "features/app/store";

const qs = require("query-string"); // eslint-disable-line @typescript-eslint/no-var-requires

interface Params {
  profileName: string;
  fromEchoId: string;
}

export default function JournalEntriesContainer() {
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const { profileName, fromEchoId } = useParams<Params>();

  const entries = useAppSelector((s) => s.journal.entries);
  const favorites = useAppSelector((s) => s.journal.favorites);
  const page = useAppSelector((s) => s.journal.page);
  const previousPage = useAppSelector((state) => state.journal.previous);
  const nextPage = useAppSelector((state) => state.journal.next);

  const [isFetching, setIsFetching] = useState(false);
  const [didLoad, setDidLoad] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEntryId, setModalEntryId] = useState<number | undefined>(
    undefined
  );

  const hasNext = nextPage !== undefined;
  const hasPrevious = previousPage !== undefined;

  const handleNext = useCallback(async () => {
    if (!nextPage) {
      return;
    }

    if (nextPage === page) {
      return;
    }

    setIsFetching(true);

    await dispatch(
      fetchJournalPage({
        characterName: profileName,
        page: nextPage,
      })
    );

    setIsFetching(false);
  }, [dispatch, nextPage, page, profileName, setIsFetching]);

  const handlePrev = useCallback(async () => {
    if (previousPage === undefined) {
      return;
    }

    if (previousPage === page) {
      return;
    }

    setIsFetching(true);

    await dispatch(
      fetchJournalPage({
        characterName: profileName,
        page: previousPage,
      })
    );

    setIsFetching(false);
  }, [dispatch, page, previousPage, profileName, setIsFetching]);

  const handleJumpToDate = useCallback(
    async (value: Date) => {
      const date = moment(value).format("YYYY-MM-DD");

      await dispatch(
        fetchJournalPage({
          characterName: profileName,
          date,
        })
      );
    },
    [dispatch, profileName]
  );

  useEffect(() => {
    if (didLoad) {
      return;
    }

    asyncUseEffect();

    async function asyncUseEffect() {
      setDidLoad(true);

      // For compatibility, accept either of the following paths:
      // /profile/:profileName/:fromEchoId
      // /profile/:profileName?fromEchoId=xxxxxxx
      const fromIdStr = fromEchoId ?? qs.parse(search)["fromEchoId"]; // eslint-disable-line dot-notation
      const fromId =
        fromIdStr != null &&
        fromIdStr !== "" &&
        !isNaN(Number(fromIdStr.toString()))
          ? parseInt(fromIdStr, 10)
          : undefined;

      await dispatch(
        fetchJournalPage({
          characterName: profileName,
          fromId,
          page: fromId === undefined ? 0 : undefined,
        })
      );

      if (fromId) {
        setModalEntryId(fromId);
        setIsModalOpen(true);
      }

      await dispatch(
        fetchJournalFavorite({
          characterName: profileName,
          page: 0,
        })
      );
    }
  }, [didLoad, dispatch, fromEchoId, profileName, search]);

  const onRequestCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setModalEntryId(undefined);
  }, []);

  return (
    <>
      <div className="journal-entries-container">
        <div className="journal-entries__header-and-controls">
          <h1 className="heading heading--1 journal-entries__header">
            Journal
          </h1>
          <NavigationControls
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            isFetching={isFetching}
            onJumpToDate={handleJumpToDate}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </div>
        <div>
          {page === 0 &&
            favorites &&
            favorites.map((entry) => (
              <JournalEntry
                data={entry}
                isFavorite
                isFetching={isFetching}
                key={entry.id}
              />
            ))}
        </div>
        <div>
          {entries &&
            entries.map((entry) => (
              <JournalEntry
                data={entry}
                isFetching={isFetching}
                key={entry.id}
              />
            ))}
        </div>
        <NavigationControls
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          isFetching={isFetching}
          onJumpToDate={handleJumpToDate}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>

      <Modal isOpen={isModalOpen} onRequestClose={() => onRequestCloseModal()}>
        {entries?.some((entry) => entry.id === modalEntryId) ? (
          entries
            .filter((entry) => entry.id === modalEntryId)
            ?.map((entry) => (
              <JournalEntry
                data={entry}
                isFetching={isFetching}
                key={modalEntryId}
              />
            ))
        ) : (
          <div
            className="journal-entry"
            style={{
              marginBottom: 16,
            }}
          >
            <div className="media__body">
              <h4 className="heading heading--2 heading--inverse journal-entry__title">
                Entry Not Found
              </h4>
              <div className="journal-entry__body">
                No entry available at this address.
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

JournalEntriesContainer.displayName = "JournalEntriesContainer";
