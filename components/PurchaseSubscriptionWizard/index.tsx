import { fetchActions } from "actions/actions";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import PaymentService from "services/PaymentService";
import {
  IBraintreeAddOn,
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
import { fetch as fetchSettings } from "actions/settings";

import CompletingTransaction from "./CompletingTransaction";
import ConfirmNewPlan from "./ConfirmNewPlan";
import PaymentFailure from "./PaymentFailure";
import PaymentSuccess from "./PaymentSuccess";
import ProvidePaymentDetails from "./ProvidePaymentDetails";
import SelectCurrency from "./SelectCurrency";
import SelectNewPlan from "./SelectNewPlan";
import ServerErrorMessage from "./ServerErrorMessage";

import { PremiumSubscriptionType } from "types/subscription";

export enum PurchaseSubscriptionWizardStep {
  /* eslint-disable no-shadow */
  SelectCurrency,
  ProvidePaymentDetails,
  CompletingTransaction,
  PaymentSuccess,
  PaymentFailure,
  ServerError,
  SelectNewPlan,
  ConfirmNewPlan,
  /* eslint-enable no-shadow */
}

interface Props {
  hasSubscription: boolean;
  onClickToClose: (didPlayerCompleteSubscription?: boolean) => void;
  renewDate?: string;
  subscriptionType?: PremiumSubscriptionType;
}

const UNKNOWN_ERROR_MESSAGE =
  "Something went wrong and we couldn't finish subscribing you." +
  " Please refresh the page and try again.";

export default function PurchaseSubscriptionWizard({
  hasSubscription,
  onClickToClose,
  renewDate,
  subscriptionType,
}: Props) {
  const dispatch = useDispatch();

  const firstStep = hasSubscription
    ? PurchaseSubscriptionWizardStep.SelectNewPlan
    : PurchaseSubscriptionWizardStep.SelectCurrency;

  const [currentStep, setCurrentStep] = useState(firstStep);
  const [braintreePlan, setBraintreePlan] = useState<
    IBraintreePlanWithClientRequestToken | undefined
  >(undefined);
  const [paymentResponseMessage, setPaymentResponseMessage] = useState<
    string | undefined
  >(undefined);
  const [serverErrorMessage, setServerErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [newSubscriptionType, setNewSubscriptionType] =
    useState<PremiumSubscriptionType>("None");
  const [addOnPrice, setAddOnPrice] = useState<number | undefined>(undefined);
  const [successTitle, setSuccessTitle] = useState("Success!");

  const onCancel = useCallback(() => {
    onClickToClose();

    setBraintreePlan(undefined);
    setCurrentStep(firstStep);
    setPaymentResponseMessage(undefined);
    setServerErrorMessage(undefined);
    setNewSubscriptionType("None");
    setAddOnPrice(undefined);
    setSuccessTitle("Success!");
  }, [firstStep, onClickToClose]);

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
    setCurrentStep(firstStep);
  }, [firstStep]);

  const onPlanChosen = useCallback(
    async (selectedPlan: IBraintreePlan, selectedAddOn?: IBraintreeAddOn) => {
      // Fetch the client request token for this plan
      const paymentService: IPaymentService = new PaymentService();
      const { data } = await paymentService.fetchPlan(
        selectedPlan.currencyIsoCode
      );

      const plan = data.plans[0];

      if (selectedAddOn) {
        plan.addOns = [selectedAddOn];
      } else {
        plan.addOns = [];
      }

      setBraintreePlan(plan);
      setCurrentStep(PurchaseSubscriptionWizardStep.ProvidePaymentDetails);
    },
    []
  );

  const onServerError = useCallback((message: string) => {
    setServerErrorMessage(message);
    setCurrentStep(PurchaseSubscriptionWizardStep.ServerError);
  }, []);

  const refreshPlayerData = useCallback(async () => {
    // wait for this, so users can't dismiss the modal before the UI reflects the sub they just paid for
    await dispatch(fetchSubscription()); // Update hassubscription state

    // Fire these, but we don't need to await them
    dispatch(fetchMyself()); // Update action count
    dispatch(fetchActions()); // Update action bank
    dispatch(fetchFate()); // Update isExceptional state
    dispatch(fetchMap()); // Update map area availability

    // wait for this one, so users can't dismiss the modal before the UI reflects the sub they just paid for
    await dispatch(fetchSettings());
  }, [dispatch]);

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
        addOnId: braintreePlan?.addOns?.[0]?.id,
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
        // wait for this, so users can't dismiss the modal before the UI reflects the sub they just paid for
        await refreshPlayerData();

        setCurrentStep(PurchaseSubscriptionWizardStep.PaymentSuccess);
        return;
      }

      setCurrentStep(PurchaseSubscriptionWizardStep.PaymentFailure);
    },
    [braintreePlan, refreshPlayerData]
  );

  const onDidSelectNewPlan = useCallback(() => {
    setCurrentStep(PurchaseSubscriptionWizardStep.ConfirmNewPlan);
  }, []);

  const onGoBackFromConfirmNewPlan = useCallback(() => {
    setCurrentStep(PurchaseSubscriptionWizardStep.SelectNewPlan);
  }, []);

  const onDidConfirmNewPlan = useCallback(
    async (
      _?: any,
      nextStep?: PurchaseSubscriptionWizardStep,
      message?: string
    ) => {
      if (nextStep === PurchaseSubscriptionWizardStep.PaymentSuccess) {
        const verb =
          newSubscriptionType === "EnhancedExceptionalFriendship" ||
          newSubscriptionType === "ExceptionalFriendship"
            ? "updated"
            : "cancelled";

        setSuccessTitle("Subscription " + verb);
        setPaymentResponseMessage(
          "Your subscription has been " + verb + "." + (message ?? "")
        );

        // wait for this, so users can't dismiss the modal before the UI reflects the sub they just paid for
        await refreshPlayerData();
      }

      if (nextStep === PurchaseSubscriptionWizardStep.PaymentFailure) {
        setPaymentResponseMessage(message ?? "");
      }

      setCurrentStep(
        nextStep ?? PurchaseSubscriptionWizardStep.CompletingTransaction
      );
    },
    [newSubscriptionType, refreshPlayerData]
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
        return (
          <PaymentSuccess
            message={paymentResponseMessage ?? ""}
            onClick={onCloseAfterSuccess}
            title={successTitle}
          />
        );
      }

      case PurchaseSubscriptionWizardStep.PaymentFailure: {
        return (
          <PaymentFailure
            message={paymentResponseMessage ?? ""}
            onClick={onCloseAfterFailure}
            onGoBack={onGoBackFromFailure}
          />
        );
      }

      case PurchaseSubscriptionWizardStep.ProvidePaymentDetails:
        if (braintreePlan && braintreePlan.clientRequestToken) {
          return (
            <ProvidePaymentDetails
              braintreePlan={braintreePlan}
              hasSubscription={hasSubscription}
              onThreeDSecureComplete={onThreeDSecureComplete}
              onGoBack={onGoBackFromPaymentDetails}
              renewDate={renewDate}
              subscriptionType={subscriptionType}
            />
          );
        }

        // Return null? Or an error page? We shouldn't be in this situation
        return null;

      case PurchaseSubscriptionWizardStep.SelectNewPlan:
        return (
          <SelectNewPlan
            onCancel={onCancel}
            onSubscriptionTypeChanged={setNewSubscriptionType}
            onSubmit={onDidSelectNewPlan}
            setAddOnPrice={setAddOnPrice}
          />
        );

      case PurchaseSubscriptionWizardStep.ConfirmNewPlan:
        return (
          <ConfirmNewPlan
            addOnPrice={addOnPrice}
            newSubscriptionType={newSubscriptionType}
            onGoBack={onGoBackFromConfirmNewPlan}
            onSubmit={onDidConfirmNewPlan}
          />
        );

      case PurchaseSubscriptionWizardStep.SelectCurrency:
      default:
        return (
          <SelectCurrency
            hasSubscription={hasSubscription}
            onCancel={onCancel}
            onPlanChosen={onPlanChosen}
            onServerError={onServerError}
            renewDate={renewDate}
            subscriptionType={subscriptionType}
          />
        );
    }
  }, [
    addOnPrice,
    braintreePlan,
    currentStep,
    hasSubscription,
    newSubscriptionType,
    onCancel,
    onClickToClose,
    onCloseAfterFailure,
    onCloseAfterSuccess,
    onDidConfirmNewPlan,
    onDidSelectNewPlan,
    onGoBackFromConfirmNewPlan,
    onGoBackFromFailure,
    onGoBackFromPaymentDetails,
    onPlanChosen,
    onServerError,
    onThreeDSecureComplete,
    paymentResponseMessage,
    renewDate,
    serverErrorMessage,
    subscriptionType,
    successTitle,
  ]);

  return <div className="purchase-panel">{content}</div>;
}
