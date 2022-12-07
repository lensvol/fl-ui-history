import React, { useCallback } from "react";
import * as SettingsActionCreators from "actions/settings";
import { useAppDispatch, useAppSelector } from "features/app/store";
import { Formik, Form, FormikHelpers, Field } from "formik";
import { MessagePreferences } from "types/settings";
import Loading from "components/Loading";

type MessagePreferenceKeys =
  | "messageAboutNiceness"
  | "messageAboutNastiness"
  | "messageAboutAnnouncements"
  | "messageAboutStorylets";

type MessagePreferencesValues = { [k in MessagePreferenceKeys]: boolean };

export default function MessagePreferencesForm() {
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
      messageAboutNastiness: values.messageAboutNastiness,
      messageAboutStorylets: values.messageAboutStorylets,
      messageAboutAnnouncements: values.messageAboutAnnouncements,
    };
  }

  return (
    <div>
      <h2 className="heading heading--2">
        When should we message you directly?
      </h2>
      <Formik
        initialValues={{
          messageAboutNiceness: messagePreferences.messageAboutNiceness,
          messageAboutNastiness: messagePreferences.messageAboutNastiness,
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
                />
              </li>
              <li className="checkbox">
                <MessagePreferenceFormItem
                  name="messageAboutNastiness"
                  label="A player wants to engage me in combat"
                />
              </li>
              <li className="checkbox">
                <MessagePreferenceFormItem
                  name="messageAboutAnnouncements"
                  label="There is an announcement about the game"
                />
              </li>
              <li className="checkbox">
                <MessagePreferenceFormItem
                  name="messageAboutStorylets"
                  label="A story develops"
                />
              </li>
            </ul>
            <button
              type="submit"
              className="button button--primary"
              disabled={!dirty || isSubmitting}
            >
              {isSubmitting ? <Loading spinner small /> : <span>Update</span>}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function MessagePreferenceFormItem({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  return (
    <label>
      <Field type="checkbox" name={name} /> {label}
    </label>
  );
}
