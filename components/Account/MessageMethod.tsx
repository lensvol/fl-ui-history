import React, { useCallback } from "react";

import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { saveMessageVia } from "actions/settings";
import * as SettingsConstants from "constants/settings";

import { MessageVia } from "services/SettingsService";
import { IAppState } from "types/app";
import { Form, Formik, Field } from "formik";
import Loading from "components/Loading";
import { ThunkDispatch } from "redux-thunk";

const RADIO_GROUP_ID = "message-via-group";

function MessageMethod({ data, dispatch, isChangingVia }: Props) {
  const { facebookAuth, twitterAuth } = data;

  const onSubmit = useCallback(
    ({ selectedMethod }: { selectedMethod: MessageVia | undefined }) => {
      if (!selectedMethod) {
        return;
      }

      dispatch(saveMessageVia(selectedMethod));
    },
    [dispatch]
  );

  return (
    <Formik
      initialValues={{
        selectedMethod: data.messageViaNetwork,
      }}
      onSubmit={onSubmit}
      render={({ dirty }) => (
        <div>
          <h2 className="heading heading--2" id={RADIO_GROUP_ID}>
            How should we message you?
          </h2>
          <Form>
            <div role="group" aria-labelledby={RADIO_GROUP_ID}>
              <RadioButton value={SettingsConstants.EMAIL} />
              {facebookAuth && (
                <RadioButton value={SettingsConstants.FACEBOOK} />
              )}
              {twitterAuth && <RadioButton value={SettingsConstants.TWITTER} />}
              <RadioButton value={SettingsConstants.NONE} />
            </div>
            <button
              className="button button--primary"
              disabled={!dirty || isChangingVia}
              type="submit"
            >
              {isChangingVia ? <Loading spinner small /> : <span>Update</span>}
            </button>
          </Form>
        </div>
      )}
    />
  );
}

function RadioButton({ value }: { value: MessageVia }) {
  return (
    <label
      className="radio"
      htmlFor={`selectedMethod-${value}`}
      style={{ marginLeft: "20px" }}
    >
      <Field
        name="selectedMethod"
        type="radio"
        value={value}
        id={`selectedMethod-${value}`}
      />
      {value}
    </label>
  );
}

const mapStateToProps = (state: IAppState) => ({
  isChangingVia: state.settings.isChangingVia,
  data: state.settings.data,
});

type Props = RouteComponentProps &
  ReturnType<typeof mapStateToProps> & {
    dispatch: ThunkDispatch<any, any, any>;
  };

export default withRouter(connect(mapStateToProps)(MessageMethod));
