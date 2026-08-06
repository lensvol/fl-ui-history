import React, { useCallback, useState } from "react";

import { useDispatch } from "react-redux";

import { fetchActions } from "actions/actions";
import { fetch as fetchFate } from "actions/fate";

import Loading from "components/Loading";
import Modal, { Props as ModalProps } from "components/Modal";
import PaymentStuff from "components/Payment/PaymentStuff";
import PurchaseFateFailure from "components/Payment/PurchaseFateFailure";
import PurchaseFateSuccess from "components/Payment/PurchaseFateSuccess";

import useIsMounted from "hooks/useIsMounted";

import PaymentService from "services/PaymentService";

import {
  IBraintreePurchaseFateRequest,
  ThreeDSecureCompleteResult,
} from "types/payment";

type Props = ModalProps & {
  onRequestClose: (_args?: any) => void;
};

enum PaymentStep {
  Details,
  Processing,
  Failure,
  Success,
}

export default function PurchaseFateModal({
  disableTouchEvents,
  isOpen,
  onRequestClose,
  style,
}: Props) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const [currentStep, setCurrentStep] = useState<PaymentStep>(
    PaymentStep.Details
  );
  const [message, setMessage] = useState<string | undefined>(undefined);

  const handleAfterClose = useCallback(() => {
    setCurrentStep(PaymentStep.Details);
  }, []);

  const handleGoBackFromFailure = useCallback(() => {
    setCurrentStep(PaymentStep.Details);
  }, []);

  const handleThreeDSecureComplete = useCallback(
    async (
      result: ThreeDSecureCompleteResult<IBraintreePurchaseFateRequest>
    ) => {
      setMessage(undefined);

      // 3DS auth failed; update message and yeet to failure
      if (!result.isSuccess) {
        setMessage(result.message);
        setCurrentStep(PaymentStep.Failure);

        return;
      }

      // Start processing
      setCurrentStep(PaymentStep.Processing);

      const { payload } = result;
      const { data } = await new PaymentService().purchaseWithBraintree(
        payload
      );

      // Bail out early if we've unmounted
      if (!isMounted.current) {
        return;
      }

      // Update message and yeet to success or failure
      setMessage(data.message);

      if (data.isSuccess) {
        dispatch(fetchFate());
        dispatch(fetchActions());
        setCurrentStep(PaymentStep.Success);

        return;
      }

      setCurrentStep(PaymentStep.Failure);
    },
    [isMounted, dispatch]
  );

  return (
    <Modal
      className="modal-dialog--purchase-fate"
      disableTouchEvents={disableTouchEvents}
      isOpen={isOpen}
      onAfterClose={handleAfterClose}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      style={style}
    >
      {isOpen && (
        <div className="purchase-panel">
          <Wizard
            currentStep={currentStep}
            message={message}
            onCancel={onRequestClose}
            onGoBackFromFailure={handleGoBackFromFailure}
            onThreeDSecureComplete={handleThreeDSecureComplete}
          />
        </div>
      )}
    </Modal>
  );
}

PurchaseFateModal.displayName = "PurchaseFateModal";

interface WizardProps {
  currentStep: PaymentStep;
  message?: string;
  onGoBackFromFailure: () => void;
  onCancel: () => void;
  onThreeDSecureComplete: (
    result: ThreeDSecureCompleteResult<IBraintreePurchaseFateRequest>
  ) => void;
}

function Wizard({
  currentStep,
  message,
  onCancel,
  onGoBackFromFailure,
  onThreeDSecureComplete,
}: WizardProps) {
  switch (currentStep) {
    case PaymentStep.Failure:
      return (
        <PurchaseFateFailure
          message={message}
          onClose={onCancel}
          onGoBack={onGoBackFromFailure}
        />
      );

    case PaymentStep.Success:
      return <PurchaseFateSuccess message={message} onClick={onCancel} />;

    case PaymentStep.Processing:
      return <Loading spinner />;

    case PaymentStep.Details:
    default:
      return (
        <>
          <h2 className="heading heading--2">Purchase Fate</h2>

          <PaymentStuff
            onCancel={onCancel}
            onThreeDSComplete={onThreeDSecureComplete}
          />
        </>
      );
  }
}

Wizard.displayName = "Wizard";
