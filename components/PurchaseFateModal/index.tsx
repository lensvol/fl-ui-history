import Loading from "components/Loading";
import Modal, { Props as ModalProps } from "components/Modal";
import { PaymentStep } from "components/Payment";
import PaymentStuff from "components/Payment/PaymentStuff";
import PurchaseFateFailure from "components/Payment/PurchaseFateFailure";
import PurchaseFateSuccess from "components/Payment/PurchaseFateSuccess";
import useIsMounted from "hooks/useIsMounted";
import React, { useCallback, useState } from "react";
import { fetch as fetchFate } from "actions/fate";
import { useDispatch } from "react-redux";
import PaymentService from "services/PaymentService";
import {
  IBraintreePurchaseFateRequest,
  ThreeDSecureCompleteResult,
} from "types/payment";

type Props = ModalProps & {
  onRequestClose: (_args?: any) => void;
};

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
      isOpen={isOpen}
      onAfterClose={handleAfterClose}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      disableTouchEvents={disableTouchEvents}
      style={style}
    >
      {isOpen && (
        <div className="purchase-panel">
          <Wizard
            currentStep={currentStep}
            message={message}
            onGoBackFromFailure={handleGoBackFromFailure}
            onCancel={onRequestClose}
            onThreeDSecureComplete={handleThreeDSecureComplete}
          />
        </div>
      )}
    </Modal>
  );
}

interface WizardProps {
  currentStep: PaymentStep;
  message: string | undefined;
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
          onGoBack={onGoBackFromFailure}
          onClose={onCancel}
          message={message}
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
