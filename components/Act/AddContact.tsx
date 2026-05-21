import React, { useCallback, useState } from "react";

import ReactModal from "react-modal";

import { useDispatch } from "react-redux";

import { addNewContact } from "actions/storylet";

import MakeContacts from "components/Infobar/MakeContacts";

import { useAppSelector } from "features/app/store";

import { IEligibleFriend } from "types/storylet";

type Props = {
  onAddContact?: (payload: {
    addedFriendId: number;
    eligibleFriends: IEligibleFriend[];
  }) => Promise<void>;
};

export default function AddContactContainer({ onAddContact }: Props) {
  const branchId = useAppSelector((state) => state.socialAct.branch?.id);

  const dispatch: Function = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [value, setValue] = useState("");
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);

  const handleChange = useCallback(
    (e: any) => {
      setValue(e.target.value);

      // Clear the message, if it's there
      if (message) {
        setMessage("");
      }
    },
    [message]
  );

  const onOpenModal = useCallback(() => {
    setIsContactsModalOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsContactsModalOpen(false);
  }, []);

  const handleSubmit = useCallback(
    async (e: any) => {
      // Prevent default submit behaviour
      e.preventDefault();

      // Absolutely don't re-submit if we're currently submitting
      if (isSubmitting) {
        return;
      }

      // Set us to submitting, to disable the UI
      setIsSubmitting(true);

      // Make the request
      const data = await dispatch(
        addNewContact({
          branchId: branchId!,
          username: value,
        })
      );

      // Get the message and the updated list of eligible friends
      const { addedFriendId, eligibleFriends, message: updatedMessage } = data;

      // Call the method we've been passed from ActContainer
      onAddContact!({
        addedFriendId,
        eligibleFriends,
      });

      // Update our local state
      setMessage(updatedMessage);
      setIsSubmitting(false);
    },
    [branchId, dispatch, isSubmitting, onAddContact, value]
  );

  if (!branchId || !onAddContact) {
    return null;
  }

  return (
    <>
      <form
        className="act__contact-choice-method"
        method="post"
        onSubmit={handleSubmit}
      >
        <label
          className="act__contact-choice-label"
          htmlFor="js-add-a-contact"
          style={{
            width: "100%",
          }}
        >
          Add a contact
          <input
            className="form__control form__control--no-border act__form-input"
            id="js-add-a-contact"
            onChange={handleChange}
            type="text"
            value={value}
          />
        </label>

        <p
          className="act__add-contact-message"
          dangerouslySetInnerHTML={{ __html: message }}
        />

        <p className="buttons act__add-and-suggest-buttons">
          <button
            className="button button--primary"
            disabled={value === "" || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>

          <button
            className="button button--primary"
            onClick={onOpenModal}
            type="button"
          >
            Make Contacts
          </button>
        </p>
      </form>

      <ReactModal
        className={{
          base: "modal--tooltip-like__content modal--access-code-challenge",
          afterOpen: "modal-dialog--after-open",
          beforeClose: "modal-dialog--before-close",
        }}
        closeTimeoutMS={150}
        isOpen={isContactsModalOpen}
        onRequestClose={onCloseModal}
        overlayClassName={{
          base: "modal-dialog__overlay modal__overlay--has-visible-backdrop",
          afterOpen: "modal-dialog__overlay--after-open",
          beforeClose: "modal-dialog__overlay--before-close",
        }}
      >
        <MakeContacts />
      </ReactModal>
    </>
  );
}

AddContactContainer.displayName = "AddContactContainer";
