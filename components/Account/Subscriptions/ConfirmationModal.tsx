import React, { useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";

import { fetch as fetchMap } from "actions/map";
import {
  fetch as fetchSubscriptions,
  modifyBraintreeSubscription,
} from "actions/subscription";

import LoadingIndicator from "components/Loading";
import Modal from "components/Modal";
import useIsMounted from "hooks/useIsMounted";

type Props = {
  dispatch: Function;
  isOpen: boolean;
  onRequestClose: () => void;
};

enum ConfirmationModalStep {
  Ready,
  Loading,
  Success,
  Error,
}

export function ConfirmationModal({ dispatch, isOpen, onRequestClose }: Props) {
  const isMounted = useIsMounted();
  const [currentStep, setCurrentStep] = useState(ConfirmationModalStep.Ready);

  const onAfterClose = useCallback(() => {
    setCurrentStep(ConfirmationModalStep.Ready);
  }, []);

  const onConfirm = useCallback(async () => {
    setCurrentStep(ConfirmationModalStep.Loading);

    try {
      // Quietly cancel
      await dispatch(
        modifyBraintreeSubscription({
          modifyInBackground: true,
          subscriptionType: "None",
        })
      );

      await dispatch(
        fetchSubscriptions({
          fetchInBackground: true,
        })
      );

      dispatch(fetchMap()); // Update map area availability

      if (isMounted.current) {
        setCurrentStep(ConfirmationModalStep.Success);
      }
    } catch (error) {
      if (isMounted.current) {
        setCurrentStep(ConfirmationModalStep.Error);
      }
    }
  }, [dispatch, isMounted]);

  const content = useMemo(() => {
    switch (currentStep) {
      case ConfirmationModalStep.Loading:
        return <LoadingIndicator spinner />;

      case ConfirmationModalStep.Success:
        return <ConfirmationModalSuccess />;

      case ConfirmationModalStep.Error:
        return <ConfirmationModalFailure />;

      case ConfirmationModalStep.Ready:
      default:
        return <ConfirmationModalReady onClick={onConfirm} />;
    }
  }, [currentStep, onConfirm]);

  return (
    <Modal
      isOpen={isOpen}
      onAfterClose={onAfterClose}
      onRequestClose={onRequestClose}
      hasExplicitCloseButton
    >
      {content}
    </Modal>
  );
}

export default connect()(ConfirmationModal);

function ConfirmationModalReady({ onClick }: { onClick: () => Promise<void> }) {
  return (
    <>
      <h3 className="heading heading--2">Confirm cancellation</h3>
      <p>
        By confirming your cancellation, you will cease to receive the benefits
        of Exceptional Friendship: you will no longer have a second candle,
        expanded opportunity deck, three additional outfits, or access to the
        House of Chimes. You will no longer receive a new Exceptional Story
        every month. You will still be able to spend Memories of a Tale in Mr
        Chimes' Lost &amp; Found.
      </p>
      <div
        className="buttons"
        style={{
          width: "100%",
        }}
      >
        <button
          type="button"
          className="button button--primary"
          onClick={onClick}
        >
          Cancel subscription
        </button>
      </div>
    </>
  );
}

function ConfirmationModalFailure() {
  return (
    <div>
      <h3 className="heading heading--2">Cancellation failed</h3>
      <p>
        Something went wrong with cancelling your subscription. Please contact
        support at{" "}
        <a className="link--inverse" href="mailto:support@failbettergames.com">
          support@failbettergames.com
        </a>
        .
      </p>
    </div>
  );
}

function ConfirmationModalSuccess() {
  return (
    <div>
      <h3 className="heading heading--2">Subscription cancelled</h3>
      <p>Your subscription has been cancelled.</p>
    </div>
  );
}
