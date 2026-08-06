import React, { useCallback, useMemo } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import { Field, Form, Formik } from "formik";

import { fetch as fetchMessages } from "actions/messages";
import { goBackFromSocialAct, sendSocialInvite } from "actions/storylet";

import { ActContextValue } from "components/Act/ActContext";
import getContactName from "components/Act/getContactName";
import Loading from "components/Loading";

import {
  ApiCharacterFriend,
  ApiInternalSocialActRequest,
} from "services/StoryletService";

import { useAppSelector } from "features/app/store";

type Props = {
  designatedFriend?: {
    name: string;
    userName: string;
  };
  eligibleFriends: ApiCharacterFriend[];
  ineligibleContacts: ActContextValue["ineligibleContacts"];
  isFetchingIneligibleContacts: boolean;
  selectedContactId?: number;
};

export default function InvitationForm({
  designatedFriend,
  eligibleFriends,
  ineligibleContacts,
  isFetchingIneligibleContacts,
  selectedContactId,
}: Props) {
  const actMessagePreview = useAppSelector(
    (state) => state.socialAct.actMessagePreview
  );
  const branch = useAppSelector((state) => state.socialAct.branch);

  const dispatch = useDispatch();

  const contactName = useMemo(() => {
    if (designatedFriend) {
      return designatedFriend.name;
    }

    return getContactName({
      eligibleFriends,
      selectedContactId,
    });
  }, [designatedFriend, eligibleFriends, selectedContactId]);

  const ineligibleDesignatedFriend = useMemo(() => {
    if (designatedFriend === undefined) {
      return undefined;
    }

    const match = `${designatedFriend.name} (${designatedFriend.userName})`;

    return ineligibleContacts.find((c: { name: string }) => c.name === match);
  }, [designatedFriend, ineligibleContacts]);

  const ineligibleDesignatedFriendMessage = useMemo(() => {
    if (ineligibleDesignatedFriend === undefined) {
      return undefined;
    }

    const { qualifies, youQualify, correctInstance } =
      ineligibleDesignatedFriend;

    const qualifiesMessage =
      qualifies !== undefined && qualifies.length > 0
        ? "they lack required qualities"
        : "";

    const youQualifyMessage =
      youQualify !== undefined && youQualify.length > 0
        ? "you lack required qualities"
        : "";

    const correctInstanceMessage =
      correctInstance !== undefined && correctInstance.length > 0
        ? "one of you is in the wrong place to carry it out"
        : "";

    const ineligibilityMessage = [
      qualifiesMessage,
      youQualifyMessage,
      correctInstanceMessage,
    ]
      .filter((s) => s !== undefined && s.length > 0)
      .join(", ");

    if (ineligibilityMessage.length > 0) {
      return `(${ineligibilityMessage})`;
    }

    return undefined;
  }, [ineligibleDesignatedFriend]);

  const disabled = useMemo(() => {
    if (!selectedContactId) {
      return true;
    }

    return ineligibleDesignatedFriend !== undefined;
  }, [ineligibleDesignatedFriend, selectedContactId]);

  const onGoBack = useCallback(
    () => dispatch(goBackFromSocialAct()),
    [dispatch]
  );

  const handleSubmit = useCallback(
    async (values) => {
      if (branch === undefined) {
        return;
      }

      if (selectedContactId === undefined) {
        return;
      }

      const data: ApiInternalSocialActRequest = {
        branchId: branch.id,
        targetCharacterId: selectedContactId,
        userMessage: values.userMessage,
      };

      await dispatch(sendSocialInvite(data));
      dispatch(fetchMessages());
    },
    [branch, dispatch, selectedContactId]
  );

  if (isFetchingIneligibleContacts) {
    return <Loading spinner />;
  }

  if (ineligibleDesignatedFriendMessage !== undefined) {
    return (
      <div>
        <div>
          {contactName} cannot currently receive this
          {ineligibleDesignatedFriendMessage.length > 0 ? " " : null}
          {ineligibleDesignatedFriendMessage}.
        </div>
        <FormButtons disabled isSubmitting={false} onGoBack={onGoBack} />
      </div>
    );
  }

  return (
    <Formik
      initialValues={{
        userMessage: "",
      }}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <h3 className="heading heading--3 u-space-above act__invitation-form-header">
            {`${contactName} will see this message:`}
          </h3>

          {actMessagePreview && (
            <p
              className="act__preset-invitation-text"
              dangerouslySetInnerHTML={{ __html: actMessagePreview ?? "" }}
            />
          )}

          <Field
            component="textarea"
            className="form__control"
            rows={3}
            name="userMessage"
            placeholder="Add a personal message with the invitation"
            maxLength={1400}
            value={values.userMessage}
          />

          {ineligibleDesignatedFriend !== undefined && (
            <div>{contactName} is currently ineligible to receive this.</div>
          )}

          <FormButtons
            disabled={disabled}
            isSubmitting={isSubmitting}
            onGoBack={onGoBack}
          />
        </Form>
      )}
    </Formik>
  );
}

type FormButtonProps = {
  disabled: boolean;
  isSubmitting: boolean;
  onGoBack: () => void;
};

function FormButtons({ disabled, isSubmitting, onGoBack }: FormButtonProps) {
  return (
    <p className="buttons buttons--no-squash act__send-or-go-back">
      <button
        className={classnames(
          "button button--primary button--no-margin",
          disabled && "button--disabled"
        )}
        disabled={disabled || isSubmitting}
        type="submit"
      >
        {isSubmitting ? <Loading spinner small /> : <span>Choose</span>}
      </button>

      <button
        className="button button--primary button--no-margin"
        onClick={onGoBack}
        type="button"
      >
        <i className="fa fa-arrow-left" /> Back
      </button>
    </p>
  );
}

InvitationForm.displayName = "InvitationForm";
