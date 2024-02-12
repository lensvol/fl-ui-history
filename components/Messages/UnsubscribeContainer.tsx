import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import unsubscribe from "actions/messages/unsubscribe";

import Loading from "components/Loading";

import wait from "utils/wait";

enum UnsubscribeStep {
  NotStarted,
  Started,
  InProgress,
  Finished,
  Stop,
}

type Params = {
  userId: string;
  token: string;
  purpose?: string;
};

export default function UnsubscribeContainer() {
  const params = useParams<Params>();
  const dispatch = useDispatch();
  const history = useHistory();

  const [unsubscribeStep, setUnsubscribeStep] = useState<UnsubscribeStep>(
    UnsubscribeStep.NotStarted
  );
  const [message, setMessage] = useState<string | undefined>(undefined);

  const startUnsubscription = useCallback(async () => {
    if (unsubscribeStep !== UnsubscribeStep.Started) {
      return;
    }

    setUnsubscribeStep(UnsubscribeStep.InProgress);

    const { data }: any = await dispatch(unsubscribe(params));

    setMessage(data.message);
    setUnsubscribeStep(UnsubscribeStep.Finished);
  }, [dispatch, params, unsubscribeStep]);

  const finishUnsubscription = useCallback(() => {
    setUnsubscribeStep(UnsubscribeStep.Stop);
  }, []);

  const redirect = useCallback(async () => {
    if (unsubscribeStep !== UnsubscribeStep.Stop) {
      return;
    }

    await wait(5000);

    history.push("/");
  }, [history, unsubscribeStep]);

  useEffect(() => {
    switch (unsubscribeStep) {
      case UnsubscribeStep.NotStarted:
        setUnsubscribeStep(UnsubscribeStep.Started);

        return;

      case UnsubscribeStep.Started:
        startUnsubscription();

        return;

      case UnsubscribeStep.Finished:
        finishUnsubscription();

        return;

      case UnsubscribeStep.Stop:
        redirect();

        return;

      default:
        return;
    }
  }, [finishUnsubscription, redirect, startUnsubscription, unsubscribeStep]);

  switch (unsubscribeStep) {
    case UnsubscribeStep.InProgress:
      return <Loading spinner />;

    case UnsubscribeStep.Stop:
      return (
        <>
          <p>{message}</p>
        </>
      );

    default:
      return null;
  }
}

UnsubscribeContainer.displayName = "UnsubscribeContainer";
