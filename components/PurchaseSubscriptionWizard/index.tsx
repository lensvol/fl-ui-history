import { fetchActions } from "actions/actions";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import PaymentService from "services/PaymentService";
import {
  IBraintreePlan,
  IBraintreePlanWithClientRequestToken,
  ICreateBraintreeSubscriptionRequest,
  IPaymentService,
  ThreeDSecureCompleteResult,
} from "types/payment";
import { fetchMyself } from "actions/myself";
import { fetch as fetchSubscription } from "actions/subscription";
import { fetch as fetchFate } from "actions/fate";
import { fetch as fetchMap } from "actions/map";

import CompletingTransaction from "./CompletingTransaction";
import PaymentFailure from "./PaymentFailure";
import PaymentSuccess from "./PaymentSuccess";
import ProvidePaymentDetails from "./ProvidePaymentDetails";
import SelectCurrency from "./SelectCurrency";
import ServerErrorMessage from "./ServerErrorMessage";

export enum PurchaseSubscriptionWizardStep {
  /* eslint-disable no-shadow */
  SelectCurrency,
  ProvidePaymentDetails,
  CompletingTransaction,
  PaymentSuccess,
  PaymentFailure,
  ServerError,
  /* eslint-enable no-shadow */
}

interface Props {
  onClickToClose: (didPlayerCompleteSubscription?: boolean) => void;
}

const UNKNOWN_ERROR_MESSAGE =
  "Something went wrong and we couldn't finish subscribing you." +
  " Please refresh the page and try again.";

export default function PurchaseSubscriptionWizard({ onClickToClose }: Props) {
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(
    PurchaseSubscriptionWizardStep.SelectCurrency
  );
  const [braintreePlan, setBraintreePlan] = useState<
    IBraintreePlanWithClientRequestToken | undefined
  >(undefined);
  const [paymentResponseMessage, setPaymentResponseMessage] = useState<
    string | undefined
  >(undefined);
  const [serverErrorMessage, setServerErrorMessage] = useState<
    string | undefined
  >(undefined);

  const onCancel = useCallback(() => {
    onClickToClose();
    setBraintreePlan(undefined);
    setCurrentStep(PurchaseSubscriptionWizardStep.SelectCurrency);
    setPaymentResponseMessage(undefined);
  }, [onClickToClose]);

  const onCloseAfterFailure = useCallback(
    () => onClickToClose(false),
    [onClickToClose]
  );

  const onCloseAfterSuccess = useCallback(() => {
    onClickToClose(true); // we completed the subscription process
  }, [onClickToClose]);

  const onGoBackFromFailure = useCallback(() => {
    setCurrentStep(PurchaseSubscriptionWizardStep.ProvidePaymentDetails);
  }, []);

  const onGoBackFromPaymentDetails = useCallback(() => {
    // Reset everything we set in the SelectCurrency step
    setBraintreePlan(undefined);
    setCurrentStep(PurchaseSubscriptionWizardStep.SelectCurrency);
  }, []);

  const onPlanChosen = useCallback(async (selectedPlan: IBraintreePlan) => {
    // Fetch the client request token for this plan
    const paymentService: IPaymentService = new PaymentService();
    const { data } = await paymentService.fetchPlan(
      selectedPlan.currencyIsoCode
    );

    setBraintreePlan(data.plans[0]);
    setCurrentStep(PurchaseSubscriptionWizardStep.ProvidePaymentDetails);
  }, []);

  const onServerError = useCallback((message: string) => {
    setServerErrorMessage(message);
    setCurrentStep(PurchaseSubscriptionWizardStep.ServerError);
  }, []);

  const onThreeDSecureComplete = useCallback(
    async (
      result: ThreeDSecureCompleteResult<{
        nonce: string;
        recaptchaResponse: string | null;
      }>
    ) => {
      // no-op
      if (!braintreePlan) {
        return;
      }

      // 3ds authentication failed
      if (!result.isSuccess) {
        setPaymentResponseMessage(result.message);
        setCurrentStep(PurchaseSubscriptionWizardStep.PaymentFailure);
        return;
      }

      setCurrentStep(PurchaseSubscriptionWizardStep.CompletingTransaction);

      const { nonce, recaptchaResponse } = result.payload;

      const purchaseRequest: ICreateBraintreeSubscriptionRequest = {
        nonce,
        recaptchaResponse,
        planId: braintreePlan?.id,
      };

      let isSuccess = false;
      let message: string = UNKNOWN_ERROR_MESSAGE;
      try {
        const response = await new PaymentService().purchasePlan(
          purchaseRequest
        );

        ({ isSuccess, message } = response.data);
      } catch (e) {
        if (e.response?.message) {
          ({ message } = e.response);
        }
      }

      setPaymentResponseMessage(message);

      if (isSuccess) {
        // Fire these, but we don't need to await them
        dispatch(fetchSubscription()); // Update hassubscription state
        dispatch(fetchMyself()); // Update action count
        dispatch(fetchActions()); // Update action bank
        dispatch(fetchFate()); // Update isExceptional state
        dispatch(fetchMap()); // Update map area availability

        setCurrentStep(PurchaseSubscriptionWizardStep.PaymentSuccess);
        return;
      }

      setCurrentStep(PurchaseSubscriptionWizardStep.PaymentFailure);
    },
    [braintreePlan, dispatch]
  );

  // noinspection UnnecessaryLocalVariableJS
  const content = useMemo(() => {
    switch (currentStep) {
      case PurchaseSubscriptionWizardStep.ServerError: {
        if (serverErrorMessage === undefined) {
          return null;
        }

        return (
          <ServerErrorMessage
            message={serverErrorMessage}
            onClickToClose={onClickToClose}
          />
        );
      }

      case PurchaseSubscriptionWizardStep.CompletingTransaction:
        return <CompletingTransaction />;

      case PurchaseSubscriptionWizardStep.PaymentSuccess: {
        if (paymentResponseMessage !== undefined) {
          return (
            <PaymentSuccess
              message={paymentResponseMessage}
              onClick={onCloseAfterSuccess}
            />
          );
        }

        // Return null? Or an error page? We shouldn't be in this situation
        return null;
      }

      case PurchaseSubscriptionWizardStep.PaymentFailure: {
        if (paymentResponseMessage !== undefined) {
          return (
            <PaymentFailure
              message={paymentResponseMessage}
              onClick={onCloseAfterFailure}
              onGoBack={onGoBackFromFailure}
            />
          );
        }

        return null;
      }

      case PurchaseSubscriptionWizardStep.ProvidePaymentDetails:
        if (braintreePlan && braintreePlan.clientRequestToken) {
          return (
            <ProvidePaymentDetails
              braintreePlan={braintreePlan}
              onThreeDSecureComplete={onThreeDSecureComplete}
              onGoBack={onGoBackFromPaymentDetails}
            />
          );
        }

        // Return null? Or an error page? We shouldn't be in this situation
        return null;

      case PurchaseSubscriptionWizardStep.SelectCurrency:
      default:
        return (
          <SelectCurrency
            onCancel={onCancel}
            onPlanChosen={onPlanChosen}
            onServerError={onServerError}
          />
        );
    }
  }, [
    braintreePlan,
    currentStep,
    onCancel,
    onClickToClose,
    onCloseAfterFailure,
    onCloseAfterSuccess,
    onGoBackFromFailure,
    onGoBackFromPaymentDetails,
    onPlanChosen,
    onServerError,
    onThreeDSecureComplete,
    paymentResponseMessage,
    serverErrorMessage,
  ]);

  return <div className="purchase-panel">{content}</div>;
}
