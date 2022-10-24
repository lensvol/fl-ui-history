import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Either, Success } from "services/BaseMonadicService";
import {
  NexQuantity,
  PaymentResult,
  IBraintreeNexOptionsResponse,
} from "types/payment";
import { fetch as fetchFate } from "actions/fate";
import ChooseFateAmountAndCurrency from "./ChooseFateAmountAndCurrency";
import PurchaseFateSuccess from "./PurchaseFateSuccess";
import ProvidePaymentDetails from "./ProvidePaymentDetails";
import PurchaseFateFailure from "./PurchaseFateFailure";

enum BraintreeViewStep {
  /* eslint-disable no-shadow */
  ChooseFateAmountAndCurrency,
  ProvidePaymentDetails,
  PaymentSuccess,
  PaymentFailure,
  ServerError,
  /* eslint-enable no-shadow */
}

interface Props {
  onCancel: () => void;
  onSubmitFinished?: (result: Either<PaymentResult>) => void;
  onSubmitStarted?: () => void;
}

export default function BraintreeView({
  onCancel,
  onSubmitFinished,
  onSubmitStarted,
}: Props) {
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState<BraintreeViewStep>(
    BraintreeViewStep.ChooseFateAmountAndCurrency
  );
  const [options, setOptions] = useState<
    IBraintreeNexOptionsResponse | undefined
  >(undefined);
  const [resultMessage, setResultMessage] = useState<string | undefined>(
    undefined
  );
  const [selectedPackage, setSelectedPackage] = useState<
    NexQuantity | undefined
  >(undefined);

  const handleGoBackFromFailure = useCallback(() => {
    setResultMessage(undefined);

    setCurrentStep(BraintreeViewStep.ProvidePaymentDetails);
  }, []);

  const handleGoBackFromProvidePaymentDetails = useCallback(() => {
    setOptions(undefined);
    setSelectedPackage(undefined);

    setCurrentStep(BraintreeViewStep.ChooseFateAmountAndCurrency);
  }, []);

  const handleNextFromChooseFateAmountAndCurrency = useCallback(
    (pkg: NexQuantity, opts: IBraintreeNexOptionsResponse) => {
      setOptions(opts);
      setSelectedPackage(pkg);

      setCurrentStep(BraintreeViewStep.ProvidePaymentDetails);
    },
    []
  );

  const handlePaymentComplete = useCallback(
    (result: Either<PaymentResult>) => {
      if (result instanceof Success) {
        setCurrentStep(BraintreeViewStep.PaymentSuccess);
        setResultMessage(undefined);
        dispatch(fetchFate());
      } else {
        setCurrentStep(BraintreeViewStep.PaymentFailure);
        setResultMessage(result.message);
      }
    },
    [dispatch]
  );

  switch (currentStep) {
    case BraintreeViewStep.ProvidePaymentDetails: {
      if (options && selectedPackage) {
        return (
          <ProvidePaymentDetails
            options={options}
            onGoBack={handleGoBackFromProvidePaymentDetails}
            onPaymentComplete={handlePaymentComplete}
            onSubmitFinished={onSubmitFinished}
            onSubmitStarted={onSubmitStarted}
            selectedPackage={selectedPackage}
          />
        );
      }

      return null;
    }

    case BraintreeViewStep.PaymentFailure: {
      if (resultMessage) {
        return (
          <PurchaseFateFailure
            message={resultMessage}
            onClose={onCancel}
            onGoBack={handleGoBackFromFailure}
          />
        );
      }

      return null;
    }

    case BraintreeViewStep.PaymentSuccess: {
      return <PurchaseFateSuccess message={resultMessage} onClick={onCancel} />;
    }

    case BraintreeViewStep.ChooseFateAmountAndCurrency:
    default:
      return (
        <ChooseFateAmountAndCurrency
          onCancel={onCancel}
          onNext={handleNextFromChooseFateAmountAndCurrency}
        />
      );
  }
}
