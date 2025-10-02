import React, { useCallback, useState } from "react";

import { useDispatch } from "react-redux";

import { Field, Form, Formik } from "formik";

import createJournalTag from "actions/journal/createJournalTag";
import fetchJournalTags from "actions/journal/fetchJournalTags";
import updateJournalTag from "actions/journal/updateJournalTag";

import Loading from "components/Loading";
import Modal from "components/Modal";

import { useAppSelector } from "features/app/store";

import { Success } from "services/BaseMonadicService";

export type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
  tagId?: number;
};

export default function TagNameModal({ isOpen, onRequestClose, tagId }: Props) {
  const dispatch = useDispatch();

  const isRenaming = tagId !== undefined;
  const oldName = useAppSelector((state) =>
    state.journal.tags.find((tag) => tag.id === tagId)
  )?.name;

  const [isComplete, setIsComplete] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleAfterClose = useCallback(() => {
    setIsComplete(false);
  }, []);

  const handleSubmit = useCallback(
    async ({ tagname }: { tagname?: string }) => {
      if (!tagname) {
        return;
      }

      if (isRenaming && tagname === oldName) {
        return;
      }

      const result = isRenaming
        ? await dispatch(
            updateJournalTag({
              id: tagId!,
              name: tagname,
            })
          )
        : await dispatch(createJournalTag(tagname));

      if (result instanceof Success) {
        setTitle("Success!");
        setMessage(
          isRenaming ? "Tag successfully renamed." : "Tag successfully created."
        );

        await dispatch(fetchJournalTags());
      } else {
        setTitle("Error");
        setMessage(
          isRenaming
            ? `There was a problem renaming ${oldName}.`
            : `There was a problem creating ${tagname}.`
        );
      }

      setIsComplete(true);
    },
    [dispatch, isRenaming, oldName, tagId]
  );

  return (
    <Modal
      isOpen={isOpen}
      onAfterClose={handleAfterClose}
      onRequestClose={onRequestClose}
    >
      {isComplete ? (
        <div>
          <h2 className="media__heading heading heading--3">{title}</h2>
          <p>{message}</p>
          <div
            className="buttons"
            style={{
              marginTop: "0.5rem",
            }}
          >
            <button
              className="button button--primary"
              onClick={onRequestClose}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <Formik
          initialValues={{
            tagname: oldName ?? "",
          }}
          onSubmit={handleSubmit}
        >
          {({ values, errors, isSubmitting, dirty }) => (
            <div>
              <Form>
                <h2 className="media__heading heading heading--3">
                  {isRenaming ? "Rename Tag" : "Create New Tag"}
                </h2>
                <p>Enter a name for your tag.</p>
                <Field
                  className="form__control"
                  maxLength={16}
                  name="tagname"
                  required
                  value={values.tagname}
                />
                {errors.tagname && (
                  <p className="form__error">{errors.tagname}</p>
                )}
                <div
                  className="buttons"
                  style={{
                    marginTop: "0.5rem",
                  }}
                >
                  <button
                    className="button button--primary"
                    disabled={!dirty || isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? <Loading spinner small /> : "Submit"}
                  </button>
                  <button
                    className="button button--primary"
                    disabled={isSubmitting}
                    onClick={onRequestClose}
                    type="button"
                  >
                    {isSubmitting ? <Loading spinner small /> : "Dismiss"}
                  </button>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      )}
    </Modal>
  );
}

TagNameModal.displayName = "TagNameModal";
