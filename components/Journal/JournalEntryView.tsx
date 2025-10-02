import React, { useCallback, useRef, useState } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import deleteJournalEntry from "actions/journal/deleteEntry";
import detachJournalTag from "actions/journal/detachJournalTag";

import Buttonlet from "components/Buttonlet";
import ManageTagsModal from "components/Journal/ManageTagsModal";
import DeleteDialog from "components/JournalEntry/DeleteDialog";

import { useAppSelector } from "features/app/store";

import { JournalEntry } from "types/journal";

const MaxTagsPerEntry = 3;

export type Props = {
  entry: JournalEntry;
  isUpdating: boolean;
};

export default function JournalEntryView({ entry, isUpdating }: Props) {
  const dispatch = useDispatch();

  const characterName = useAppSelector((state) => state.myself.character.name);
  const page = useAppSelector((state) => state.journal.page);

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const onShowTagModal = useCallback(() => {
    setIsTagModalOpen(!isTagModalOpen);
  }, [isTagModalOpen]);

  const onCopyToClipboard = useCallback(() => {
    if (characterName) {
      const url =
        window.location.origin +
        "/profile/" +
        encodeURIComponent(characterName) +
        "/" +
        entry.id;

      navigator.clipboard.writeText(url);

      var style = document.getElementById("linkTooltip_" + entry.id)?.style;

      if (!style) {
        return;
      }

      style.visibility = "visible";

      setTimeout(() => {
        if (style) {
          style.visibility = "hidden";
        }
      }, 1000);
    }
  }, [characterName, entry]);

  const onDetachTag = useCallback(
    async (tagId: number) => {
      await dispatch(
        detachJournalTag({
          entryId: entry.id,
          tagId,
        })
      );
    },
    [dispatch, entry]
  );

  const doShowDeleteConfirm = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const doDismissDeleteConfirm = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const deleteAndClose = useCallback(async () => {
    await dispatch(
      deleteJournalEntry({
        entryId: entry.id,
        page,
      })
    );

    doDismissDeleteConfirm();
  }, [dispatch, doDismissDeleteConfirm, entry, page]);

  return (
    <>
      <div
        className={classnames(
          "journal-entry-margin",
          isUpdating && "journal-entry--is-fetching"
        )}
        style={{
          marginBottom: "16px",
        }}
      >
        <div className="journal-entry-content media__body">
          <div className="journal-entry__buttonlet">
            <span className="profile__contacts-container">
              <div
                id={`linkTooltip_${entry.id}`}
                className="profile__contacts-alert"
                style={{
                  color: "#efefef",
                  visibility: "hidden",
                }}
              >
                Link copied to clipboard!
              </div>
              <i
                className="link--inverse journal-entry__permalink fa fa-link heading--1"
                onClick={onCopyToClipboard}
              />
            </span>{" "}
            <Buttonlet
              onClick={doShowDeleteConfirm}
              title="Delete this entry"
              type="delete"
            />
          </div>
          <h4
            className="heading heading--2 heading--inverse journal-entry__title"
            dangerouslySetInnerHTML={{ __html: entry.eventName }}
          />
          <h2 className="media__heading heading heading--3 journal-entry__date-and-location">
            <span className="journal-entry__date">
              {entry.fallenLondonDateTime}{" "}
            </span>
            <span className="journal-entry__location">
              {entry.areaName && `(${entry.areaName})`}
            </span>
          </h2>
          <div>
            <div className="journal-entry-tag-container">
              <span ref={ref} style={{ position: "absolute" }} />
              {entry.tags.length < MaxTagsPerEntry && (
                <div className="journal-tag-chevron-add-tag journal-tag-bg-none">
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                    onClick={onShowTagModal}
                  >
                    <i className="fa fa-plus" /> Add Tag
                  </div>
                </div>
              )}
              {entry.tags.map((tag, index) => (
                <div
                  key={tag.id}
                  className={classnames(
                    index === 0 && entry.tags.length >= MaxTagsPerEntry
                      ? "journal-tag-chevron-first"
                      : "journal-tag-chevron-additional",
                    `journal-tag-bg-${tag.color.toLocaleLowerCase()}`
                  )}
                >
                  {tag.isFavorite && (
                    <>
                      <i className="fa fa-star" />{" "}
                    </>
                  )}
                  {tag.name}{" "}
                  <i
                    className="fa fa-times journal-tag-modal-pointer"
                    onClick={() => onDetachTag(tag.id)}
                  />
                </div>
              ))}
            </div>

            <div
              className="journal-entry__body"
              dangerouslySetInnerHTML={{ __html: entry.playerMessage }}
            />
          </div>
        </div>
      </div>

      <DeleteDialog
        isOpen={isDeleteModalOpen}
        isFetching={isUpdating}
        onConfirm={deleteAndClose}
        onRequestClose={doDismissDeleteConfirm}
      />

      <ManageTagsModal
        entryId={entry.id}
        isEditing={false}
        isOpen={isTagModalOpen}
        onRequestClose={onShowTagModal}
        overlayRef={ref}
      />
    </>
  );
}

JournalEntryView.displayName = "JournalEntryView";
