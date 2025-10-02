import React, { useCallback, useState } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import deleteJournalEntry from "actions/journal/deleteEntry";

import Buttonlet from "components/Buttonlet";
import DeleteDialog from "components/JournalEntry/DeleteDialog";

import { useAppSelector } from "features/app/store";

import { ApiSharedContent } from "services/ProfileService";

type Props = {
  data: ApiSharedContent;
  isFavorite?: boolean;
  isFetching: boolean;
};

export default function JournalEntry({ data, isFavorite, isFetching }: Props) {
  const dispatch = useDispatch();

  const canEdit = useAppSelector(
    (state) => state.profile.isLoggedInUsersProfile
  );
  const profileCharacter = useAppSelector(
    (state) => state.profile.profileCharacter
  );
  const page = useAppSelector((state) => state.journal.page);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const showModal = useCallback(() => {
    setModalIsOpen(true);
  }, []);

  const handleRequestClose = useCallback(() => {
    setModalIsOpen(false);
  }, []);

  const deleteAndClose = useCallback(async () => {
    // What are we doing here if we can't edit this profile? Never mind; just return
    if (!canEdit) {
      return;
    }

    await dispatch(
      deleteJournalEntry({
        entryId: data.id,
        page,
      })
    );

    handleRequestClose();
  }, [canEdit, data, dispatch, handleRequestClose, page]);

  const copyLinkToClipboard = useCallback(() => {
    const characterName = profileCharacter?.name;

    if (!characterName) {
      return;
    }

    const id = data.id;
    const url =
      window.location.origin +
      "/profile/" +
      encodeURIComponent(characterName) +
      "/" +
      id;

    navigator.clipboard.writeText(url);

    var style = document.getElementById("linkTooltip_" + id)?.style;

    if (!style) {
      return;
    }

    style.visibility = "visible";

    setTimeout(() => {
      if (style) {
        style.visibility = "hidden";
      }
    }, 1000);
  }, [data, profileCharacter]);

  if (!profileCharacter) {
    return null;
  }

  return (
    <>
      <div
        className={classnames(
          "journal-entry",
          isFavorite && "journal-entry--is-favourite",
          isFetching && "journal-entry--is-fetching"
        )}
        style={{
          marginBottom: 16,
        }}
      >
        <div className="media__body">
          <div className="journal-entry__buttonlet">
            <span className="profile__contacts-container">
              <div
                className="profile__contacts-alert"
                id={"linkTooltip_" + data.id}
                style={{
                  color: "#efefef",
                  visibility: "hidden",
                }}
              >
                Link copied to clipboard!
              </div>
              <i
                className="link--inverse journal-entry__permalink fa fa-link heading--1"
                onClick={copyLinkToClipboard}
              />
            </span>
            {isFavorite && (
              <span>
                <i
                  className="journal-entry__permalink fa fa-star heading--1"
                  style={{
                    color: "#3f7277",
                  }}
                  title="Favourite entry"
                />
              </span>
            )}{" "}
            {canEdit && (
              <>
                <Buttonlet
                  onClick={showModal}
                  title="Delete this entry"
                  type="delete"
                />
              </>
            )}
          </div>
          <h4
            className="heading heading--2 heading--inverse journal-entry__title"
            dangerouslySetInnerHTML={{ __html: data.eventName }}
          />
          <h2 className="media__heading heading heading--3 journal-entry__date-and-location">
            <span className="journal-entry__date">
              {data.fallenLondonDateTime}{" "}
            </span>
            <span className="journal-entry__location">
              {data.areaName && `(${data.areaName})`}
            </span>
          </h2>
          <div
            className="journal-entry__body"
            dangerouslySetInnerHTML={{ __html: data.playerMessage }}
          />
        </div>
      </div>

      <DeleteDialog
        isFetching={isFetching}
        isOpen={modalIsOpen}
        onConfirm={deleteAndClose}
        onRequestClose={handleRequestClose}
      />
    </>
  );
}

JournalEntry.displayName = "JournalEntry";
