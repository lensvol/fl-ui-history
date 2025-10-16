import React, { RefObject, useCallback, useState } from "react";

import ReactModal from "react-modal";

import classnames from "classnames";

import Buttonlet from "components/Buttonlet";
import ManageTagsModalEntry from "components/Journal/ManageTagsModalEntry";
import TagNameModal from "components/Journal/TagNameModal";

import { useAppSelector } from "features/app/store";

const MaxTagsPerUser = 25;

export type Props = {
  entryId?: number;
  isEditing: boolean;
  isOpen: boolean;
  onRequestClose: () => void;
  overlayRef: RefObject<HTMLDivElement>;
};

export default function ManageTagsModal({
  entryId,
  isEditing,
  isOpen,
  onRequestClose,
  overlayRef,
}: Props) {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const userTags = useAppSelector((state) => state.journal.tags);
  const entryTags =
    useAppSelector((state) =>
      state.journal.entries?.find((entry) => entry.id === entryId)
    )?.tags ?? [];

  const isEmpty = userTags.length === 0;
  const isFull = userTags.length === MaxTagsPerUser;

  const onCreateTag = useCallback(() => {
    if (isTagModalOpen) {
      return;
    }

    if (userTags.length >= MaxTagsPerUser) {
      return;
    }

    setIsTagModalOpen(true);
  }, [isTagModalOpen, userTags]);

  const onRequestCloseCreate = useCallback(() => {
    setIsTagModalOpen(false);
  }, []);

  if (!isOpen) {
    return null;
  }

  if (!overlayRef.current) {
    return null;
  }

  return (
    <>
      <ReactModal
        className="journal-manage-tags-modal-content"
        overlayClassName={
          isEditing
            ? "journal-manage-tags-modal-overlay"
            : "journal-select-tags-modal-overlay"
        }
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        bodyOpenClassName={null}
        parentSelector={() => overlayRef.current!}
      >
        <div className="journal-manage-tags-modal">
          {isEmpty ? (
            <div
              className={classnames(
                isEditing
                  ? "journal-manage-tags-modal-row-edit"
                  : "journal-manage-tags-modal-row",
                "journal-no-tags"
              )}
            >
              No Tags Created
            </div>
          ) : (
            <>
              {userTags
                .filter(
                  (tag) =>
                    entryId === undefined ||
                    !entryTags.some((t) => t.id === tag.id)
                )
                .map((tag, index) => (
                  <ManageTagsModalEntry
                    entryId={entryId}
                    isEditing={isEditing}
                    isLast={!isFull && index === userTags.length - 1}
                    key={tag.id}
                    onRequestClose={onRequestClose}
                    tag={tag}
                  />
                ))}
            </>
          )}
          {!isFull && (
            <div
              className={classnames(
                isEditing
                  ? "journal-manage-tags-modal-row-edit"
                  : "journal-manage-tags-modal-row"
              )}
            >
              <div className="journal-create-tag" onClick={onCreateTag}>
                Create New Tag...
              </div>
            </div>
          )}
        </div>

        <div className="modal-dialog__close-button--media-large">
          <Buttonlet
            classNames={{
              buttonletClassName: "journal-manage-tags-buttonlet",
              circleClassName: "journal-manage-tags-buttonlet-circle",
              containerClassName: "journal-manage-tags-buttonlet-container",
            }}
            onClick={onRequestClose}
            style={{
              margin: "-18px",
            }}
            type="delete"
          />
        </div>
      </ReactModal>

      <TagNameModal
        isOpen={isTagModalOpen}
        onRequestClose={onRequestCloseCreate}
      />
    </>
  );
}

ManageTagsModal.displayName = "ManageTagsModal";
