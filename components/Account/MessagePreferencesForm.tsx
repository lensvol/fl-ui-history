import React, { useCallback, ReactNode } from "react";
import * as SettingsActionCreators from "actions/settings";
import { useAppDispatch, useAppSelector } from "features/app/store";
import { Formik, Form, FormikHelpers, Field } from "formik";
import { MessagePreferences } from "types/settings";
import Loading from "components/Loading";

type MessagePreferenceKeys =
  | "messageAboutNiceness"
  | "messageAboutAnnouncements"
  | "messageAboutStorylets";

type MessagePreferencesValues = { [k in MessagePreferenceKeys]: boolean };

export default function MessagePreferencesForm() {
  const hasEmailAddress = useAppSelector(
    (state) => state.user.user?.hasMessagingEmail ?? false
  );
  const messagePreferences = useAppSelector(
    (state) => state.settings.messagePreferences
  );
  const dispatch = useAppDispatch();

  const handleSubmit = useCallback(
    async (
      values: MessagePreferencesValues,
      helpers: FormikHelpers<MessagePreferencesValues>
    ) => {
      helpers.setSubmitting(true);
      await dispatch(
        SettingsActionCreators.saveMessagePreferences(
          valuesToPreferences(values)
        )
      );
      helpers.setSubmitting(false);
    },
    [dispatch]
  );

  function valuesToPreferences(
    values: MessagePreferencesValues
  ): MessagePreferences {
    return {
      messageAboutNiceness: values.messageAboutNiceness,
      messageAboutStorylets: values.messageAboutStorylets,
      messageAboutAnnouncements: values.messageAboutAnnouncements,
    };
  }

  if (!hasEmailAddress) {
    return null;
  }

  return (
    <div>
      <h2 className="heading heading--2">
        When should we message you directly?
      </h2>
      <Formik
        initialValues={{
          messageAboutNiceness: messagePreferences.messageAboutNiceness,
          messageAboutAnnouncements:
            messagePreferences.messageAboutAnnouncements,
          messageAboutStorylets: messagePreferences.messageAboutStorylets,
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            <ul>
              <li className="checkbox">
                <MessagePreferenceFormItem
                  name="messageAboutNiceness"
                  label="A player invites me to something"
                >
                  <>
                    <p>
                      You'll get an email when a player invites you to
                      participate in a social activity in Fallen London.
                    </p>
                  </>
                </MessagePreferenceFormItem>
              </li>
              <li className="checkbox">
                <MessagePreferenceFormItem
                  name="messageAboutAnnouncements"
                  label="When there is an announcement about the game"
                >
                  <p>
                    You'll receive an email when there is an announcement
                    regarding the game — including new stories, festivals and
                    time-sensitive content. This also includes our monthly
                    newsletter — a roundup of bits and bobs about our games,{" "}
                    weird historical things, other games we like, and so on.
                  </p>
                </MessagePreferenceFormItem>
              </li>
              <li className="checkbox">
                <MessagePreferenceFormItem
                  name="messageAboutStorylets"
                  label="A story develops"
                >
                  <p>
                    When a Living Story timer advances, unlocking a repeatable
                    action or a story development in Fallen London.
                  </p>
                </MessagePreferenceFormItem>
              </li>
            </ul>
            <div className="buttons">
              <button
                type="submit"
                className="button button--primary"
                disabled={!dirty || isSubmitting}
              >
                {isSubmitting ? <Loading spinner small /> : <span>Update</span>}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function MessagePreferenceFormItem({
  name,
  label,
  children,
}: {
  name: string;
  label: string;
  children?: ReactNode;
}) {
  return (
    <label
      style={{
        display: "flex",
        borderBottom: "2px solid #91856e",
      }}
    >
      <Field type="checkbox" name={name} />
      <div>
        <div>{label}</div>
        {children}
      </div>
    </label>
  );
}
