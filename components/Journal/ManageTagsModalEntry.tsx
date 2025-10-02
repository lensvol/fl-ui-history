import React, { useCallback, useState } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import attachJournalTag from "actions/journal/attachJournalTag";
import deleteJournalTag from "actions/journal/deleteJournalTag";
import fetchJournalPage from "actions/journal/fetchJournalPage";
import updateJournalTag from "actions/journal/updateJournalTag";

import TagNameModal from "components/Journal/TagNameModal";
import JournalTagColorPicker from "components/Journal/JournalTagColorPicker";
import Modal from "components/Modal";

import { useAppSelector } from "features/app/store";

import { JournalTagEntry } from "types/journal";

export type Props = {
  entryId?: number;
  isEditing: boolean;
  isLast: boolean;
  onRequestClose: () => void;
  tag: JournalTagEntry;
};

export default function ManageTagsModalEntry({
  entryId,
  isEditing,
  isLast,
  onRequestClose,
  tag,
}: Props) {
  const dispatch = useDispatch();

  const filterBy = useAppSelector((state) => state.journal.filterBy);
  const sortBy = useAppSelector((state) => state.journal.sortBy);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const onToggleFavorite = useCallback(async () => {
    await dispatch(
      updateJournalTag({
        id: tag.id,
        isFavorite: !tag.isFavorite,
      })
    );
  }, [dispatch, tag]);

  const onRename = useCallback(() => {
    setIsRenameModalOpen(true);
  }, []);

  const onRequestCloseRename = useCallback(() => {
    setIsRenameModalOpen(false);
  }, []);

  const onConfirmDelete = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const doDismissDeleteConfirm = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const onDelete = useCallback(async () => {
    await dispatch(deleteJournalTag(tag.id));

    await dispatch(
      fetchJournalPage({
        filterBy,
        page: 0,
        sortBy,
      })
    );
  }, [dispatch, filterBy, sortBy, tag]);

  const onAttach = useCallback(async () => {
    if (!entryId) {
      return;
    }

    await dispatch(
      attachJournalTag({
        entryId,
        tagId: tag.id,
      })
    );

    onRequestClose();
  }, [dispatch, entryId, onRequestClose, tag]);

  if (isEditing) {
    return (
      <>
        <div className="journal-manage-tags-modal-row-edit">
          <div className="journal-tag-modal-prefix-edit">
            <i
              className={classnames(
                "fa fa-star",
                tag.isFavorite && "journal-tag-favorite",
                isLast && "journal-tag-modal-last-endcap"
              )}
              onClick={onToggleFavorite}
            />
          </div>

          <div
            className={classnames(
              "journal-tag-modal-center-edit",
              isLast && "journal-tag-modal-last"
            )}
          >
            <div className="journal-tag-modal-pointer" onClick={onRename}>
              {tag.name}
            </div>
            <JournalTagColorPicker tag={tag} />
          </div>

          <div className="journal-tag-modal-suffix">
            <i
              className={classnames(
                "fa fa-trash",
                isLast && "journal-tag-modal-last-endcap"
              )}
              onClick={onConfirmDelete}
            />
          </div>
        </div>

        <TagNameModal
          isOpen={isRenameModalOpen}
          onRequestClose={onRequestCloseRename}
          tagId={tag.id}
        />

        <Modal
          isOpen={isDeleteModalOpen}
          onRequestClose={doDismissDeleteConfirm}
        >
          <div>
            <h2 className="heading heading--2 heading--inverse">
              Delete this tag?
            </h2>
            <hr />
            <div className="modal__body">
              <p>Are you sure you want to delete this tag?</p>
            </div>
            <div className="buttons">
              <button
                className="button button--primary"
                disabled={false}
                onClick={onDelete}
                type="button"
              >
                Delete
              </button>
              <button
                className="button button--primary"
                disabled={false}
                onClick={doDismissDeleteConfirm}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  }

  return (
    <div className="journal-manage-tags-modal-row journal-manage-tags-modal-row-nonempty">
      <div className="journal-tag-modal-prefix">
        {tag.isFavorite ? (
          <i
            className={classnames(
              "fa fa-star",
              `journal-tag-fg-${tag.color.toLocaleLowerCase()}`
            )}
          />
        ) : (
          <div
            className={classnames(
              "journal-tag-color",
              `journal-tag-bg-${tag.color.toLocaleLowerCase()}`
            )}
          />
        )}
      </div>

      <div
        className={classnames(
          "journal-tag-modal-center",
          isLast && "journal-tag-modal-last"
        )}
      >
        <div className="journal-tag-modal-pointer" onClick={onAttach}>
          {tag.name}
        </div>
      </div>
    </div>
  );
}

ManageTagsModalEntry.displayName = "ManageTagsModalEntry";
