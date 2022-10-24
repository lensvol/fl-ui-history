import React, { useCallback, useMemo } from "react";
import classnames from "classnames";
import Loading from "components/Loading";
import { connect } from "react-redux";
import { Field, Formik, Form } from "formik";

import { fetch as fetchMessages } from "actions/messages";
import { goBackFromSocialAct, sendSocialInvite } from "actions/storylet";
import { ThunkDispatch } from "redux-thunk";

import {
  ApiCharacterFriend,
  ApiInternalSocialActRequest,
} from "services/StoryletService";
import { IAppState } from "types/app";

import getContactName from "./getContactName";

function InvitationFormContainer({
  actMessagePreview,
  branch,
  designatedFriend,
  dispatch,
  eligibleFriends,
  selectedContactId,
}: Props) {
  const contactName = useMemo(() => {
    if (designatedFriend) {
      return designatedFriend.name;
    }
    return getContactName({ eligibleFriends, selectedContactId });
  }, [designatedFriend, eligibleFriends, selectedContactId]);

  const disabled = useMemo(() => !selectedContactId, [selectedContactId]);

  const onGoBack = useCallback(
    () => dispatch(goBackFromSocialAct()),
    [dispatch]
  );

  const handleSubmit = useCallback(
    async (values) => {
      if (branch?.id === undefined) {
        return;
      }

      if (selectedContactId === undefined) {
        return;
      }

      const data: ApiInternalSocialActRequest = {
        branchId: branch?.id,
        targetCharacterId: selectedContactId,
        userMessage: values.userMessage,
      };

      await dispatch(sendSocialInvite(data));
      dispatch(fetchMessages());
    },
    [branch, dispatch, selectedContactId]
  );

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

          <p className="buttons buttons--no-squash act__send-or-go-back">
            <button
              type="submit"
              className={classnames(
                "button button--primary",
                "button--no-margin",
                disabled && "button--disabled"
              )}
              disabled={disabled || isSubmitting}
            >
              {isSubmitting ? <Loading spinner small /> : <span>Choose</span>}
            </button>

            <button
              type="button"
              className="button button--primary button--no-margin"
              onClick={onGoBack}
            >
              <i className="fa fa-arrow-left" /> Back
            </button>
          </p>
        </Form>
      )}
    </Formik>
  );
}

type OwnProps = {
  designatedFriend: undefined | { name: string };
  eligibleFriends: ApiCharacterFriend[];
  selectedContactId: number | undefined;
};

const mapStateToProps = ({
  socialAct: { actMessagePreview, branch },
}: IAppState) => ({
  actMessagePreview,
  branch,
});

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> & {
    dispatch: ThunkDispatch<any, any, any>;
  };

export default connect(mapStateToProps)(InvitationFormContainer);
