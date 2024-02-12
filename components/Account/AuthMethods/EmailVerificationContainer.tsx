import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import confirmEmail from "actions/registration/confirmEmail";

import Loading from "components/Loading";

import wait from "utils/wait";

enum VerifyEmailStep {
  NotStarted,
  Started,
  InProgress,
  Finished,
  Stop,
}

type Params = {
  token: string;
};

export default function EmailVerificationContainer() {
  const params = useParams<Params>();
  const token = params.token;
  const dispatch = useDispatch();
  const history = useHistory();

  const [verifyStep, setVerifyStep] = useState<VerifyEmailStep>(
    VerifyEmailStep.NotStarted
  );
  const [message, setMessage] = useState<string | undefined>(undefined);

  const startVerification = useCallback(async () => {
    if (verifyStep !== VerifyEmailStep.Started) {
      return;
    }

    setVerifyStep(VerifyEmailStep.InProgress);

    const response: any = await dispatch(
      confirmEmail({
        token,
      })
    );

    setMessage(response.message);
    setVerifyStep(VerifyEmailStep.Finished);
  }, [dispatch, token, verifyStep]);

  const finishVerification = useCallback(() => {
    setVerifyStep(VerifyEmailStep.Stop);
  }, []);

  const redirect = useCallback(async () => {
    if (verifyStep !== VerifyEmailStep.Stop) {
      return;
    }

    await wait(5000);

    history.push("/");
  }, [history, verifyStep]);

  useEffect(() => {
    switch (verifyStep) {
      case VerifyEmailStep.NotStarted:
        setVerifyStep(VerifyEmailStep.Started);

        return;

      case VerifyEmailStep.Started:
        startVerification();

        return;

      case VerifyEmailStep.Finished:
        finishVerification();

        return;

      case VerifyEmailStep.Stop:
        redirect();

        return;

      default:
        return;
    }
  }, [finishVerification, redirect, startVerification, verifyStep]);

  switch (verifyStep) {
    case VerifyEmailStep.InProgress:
      return <Loading spinner />;

    case VerifyEmailStep.Stop:
      return (
        <>
          <p>{message}</p>
        </>
      );

    default:
      return null;
  }
}

EmailVerificationContainer.displayName = "EmailVerificationContainer";
