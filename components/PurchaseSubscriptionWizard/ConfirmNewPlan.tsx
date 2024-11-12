import React, { useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";

import { Dropin, PaymentMethodRequestablePayload } from "braintree-web-drop-in";

import { Form, Formik } from "formik";

import { isDowngradedSubscription } from "actions/fate/subscriptions";
import { modifyBraintreeSubscription } from "actions/subscription";

import Loading from "components/Loading";
import BraintreeDropIn from "components/Payment/BraintreeWebDropIn";
import getSubscriptionBraintreeOptions from "components/Payment/getSubscriptionBraintreeOptions";
import {
  formValuesToBillingAddress,
  GENERIC_THREE_D_SECURE_FAILURE_MESSAGE,
  INITIAL_VALUES,
  PersonalDetails,
} from "components/Payment/PaymentStuff";
import { PurchaseSubscriptionWizardStep } from "components/PurchaseSubscriptionWizard";

import useIsMounted from "hooks/useIsMounted";

import { IAppState } from "types/app";
import {
  IBraintreePlanWithClientRequestToken,
  PaymentMethodType,
  ThreeDSecureParameters,
} from "types/payment";
import { ISubscriptionData, PremiumSubscriptionType } from "types/subscription";

export function ConfirmNewPlan({
  addOnPrice,
  braintreePlan,
  dispatch,
  hasSubscription,
  newSubscriptionType,
  onGoBack,
  onSubmit,
  subscriptionData,
  subscriptionType,
}: Props) {
  const isEnhanced = subscriptionType === "EnhancedExceptionalFriendship";
  const isMounted = useIsMounted();

  const [submitting, setSubmitting] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<
    PaymentMethodType | undefined
  >(undefined);
  const [dropInInstance, setDropInInstance] = useState<Dropin | undefined>(
    undefined
  );
  const [isPaymentMethodRequestable, setIsPaymentMethodRequestable] =
    useState(false);

  const handleInstance = useCallback((instance: Dropin | undefined) => {
    setDropInInstance(instance);
  }, []);

  const handleNoPaymentMethodRequestable = useCallback(() => {
    setIsPaymentMethodRequestable(false);
    setCurrentPaymentMethod(undefined);
  }, []);

  const handlePaymentMethodRequestable = useCallback(
    (payload: PaymentMethodRequestablePayload) => {
      setIsPaymentMethodRequestable(true);
      setCurrentPaymentMethod(payload.type);
    },
    []
  );

  const didRecentlyDowngrade = isDowngradedSubscription(
    hasSubscription,
    subscriptionType
  );
  const shouldGetPayment =
    !didRecentlyDowngrade &&
    newSubscriptionType === "EnhancedExceptionalFriendship";

  const doSubmit = useCallback(
    async (values, _helpers) => {
      setSubmitting(true);

      let deviceData: string | undefined;
      let nonce: string | undefined;
      let paymentType: string | undefined;

      try {
        if (shouldGetPayment) {
          if (dropInInstance === undefined) {
            console.error("Trying to submit without a Braintree instance");

            return;
          }

          const requestPaymentMethodPayload: {
            threeDSecure: ThreeDSecureParameters;
          } = {
            threeDSecure: {
              amount: (addOnPrice ?? 0).toFixed(2),
              billingAddress: formValuesToBillingAddress(values),
              collectDeviceData: true,
              email: values.email,
            },
          };

          const payload = await dropInInstance.requestPaymentMethod(
            requestPaymentMethodPayload
          );

          onSubmit(PurchaseSubscriptionWizardStep.CompletingTransaction);

          if (payload.type === "CreditCard") {
            if (!payload.threeDSecureInfo?.liabilityShifted) {
              console.error(
                "Liability did not shift as a result of 3DS authentication"
              );

              onSubmit(
                PurchaseSubscriptionWizardStep.PaymentFailure,
                GENERIC_THREE_D_SECURE_FAILURE_MESSAGE
              );

              return;
            }
          }

          deviceData = payload.deviceData;
          nonce = payload.nonce;
          paymentType = payload.type;
        } else {
          onSubmit(PurchaseSubscriptionWizardStep.CompletingTransaction);
        }

        const data = await dispatch(
          modifyBraintreeSubscription({
            deviceData,
            modifyInBackground: true,
            nonce,
            paymentType,
            subscriptionType: newSubscriptionType,
          })
        );

        if (isMounted.current) {
          setSubmitting(false);
        }

        if (data.isSuccess) {
          onSubmit(PurchaseSubscriptionWizardStep.PaymentSuccess, data.message);
        } else {
          onSubmit(PurchaseSubscriptionWizardStep.PaymentFailure, data.message);
        }
      } catch (error) {
        const err: any = error;

        onSubmit(
          PurchaseSubscriptionWizardStep.PaymentFailure,
          err?.response?.message ?? err?.message
        );
      }
    },
    [
      addOnPrice,
      dispatch,
      dropInInstance,
      isMounted,
      newSubscriptionType,
      onSubmit,
      shouldGetPayment,
    ]
  );

  const formattedRenewDate = new Date(
    subscriptionData?.renewDate ?? ""
  ).toLocaleDateString("en-gb", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const nextButtonText =
    subscriptionType === "ExceptionalFriendship" &&
    newSubscriptionType === "EnhancedExceptionalFriendship"
      ? "Proceed to Payment"
      : newSubscriptionType === "None"
        ? "Cancel Subscription"
        : "Confirm Changes";

  const amountChargedText = didRecentlyDowngrade
    ? "No charge"
    : (addOnPrice ?? "") + " " + (subscriptionData?.currencyIsoCode ?? "");

  const options = useMemo(() => {
    return getSubscriptionBraintreeOptions({
      authorization: braintreePlan.clientRequestToken,
      currencyIsoCode: braintreePlan.currencyIsoCode,
      price: addOnPrice ?? 0,
    });
  }, [addOnPrice, braintreePlan]);

  return (
    <>
      <h1 className="media__heading heading heading--2 fate-header">
        Confirm Changes
      </h1>

      <div className="ef-subscription-panel">
        <div className="ef-subscription-options">
          <div className="lede">Subscription changes:</div>
          <div className="ef-subscription-detail">
            From:{" "}
            {isEnhanced ? (
              <>
                <span className="enhanced-text">Enhanced</span> (
                {(subscriptionData?.price ?? 0) +
                  (subscriptionData?.addOnPrice ?? 0)}{" "}
                {subscriptionData?.currencyIsoCode}/month)
              </>
            ) : (
              <>
                Standard ({subscriptionData?.price}{" "}
                {subscriptionData?.currencyIsoCode}/month)
              </>
            )}
          </div>
          <div className="lede"></div>
          <div
            className="ef-subscription-detail"
            style={{
              fontWeight: "bold",
            }}
          >
            To:{" "}
            {newSubscriptionType === "EnhancedExceptionalFriendship" && (
              <>
                <span className="enhanced-text">Enhanced</span> (
                {(subscriptionData?.price ?? 0) + (addOnPrice ?? 0)}{" "}
                {subscriptionData?.currencyIsoCode}/month)
              </>
            )}
            {newSubscriptionType === "ExceptionalFriendship" && (
              <>
                Standard ({subscriptionData?.price}{" "}
                {subscriptionData?.currencyIsoCode}/month)
              </>
            )}
            {newSubscriptionType === "None" && <>None</>}
          </div>
          <div className="lede"></div>
          <div
            className="ef-subscription-detail"
            style={{
              padding: "1rem 0",
            }}
          >
            {newSubscriptionType === "None" ? (
              <>Subscription expiration date:</>
            ) : (
              <>Next monthly payment:</>
            )}{" "}
            {formattedRenewDate}
          </div>
        </div>

        {newSubscriptionType === "EnhancedExceptionalFriendship" && (
          <>
            <div className="ef-subscription-options">
              <div className="lede">Amount charged now:</div>
              <div className="ef-subscription-detail">{amountChargedText}</div>
            </div>
          </>
        )}

        <Formik initialValues={INITIAL_VALUES} onSubmit={doSubmit}>
          {({ values }) => (
            <Form>
              {shouldGetPayment && (
                <>
                  <BraintreeDropIn
                    onInstance={handleInstance}
                    onNoPaymentMethodRequestable={
                      handleNoPaymentMethodRequestable
                    }
                    onPaymentMethodRequestable={handlePaymentMethodRequestable}
                    options={options}
                  />
                  {currentPaymentMethod === "CreditCard" && (
                    <PersonalDetails values={values} />
                  )}
                </>
              )}

              <div
                className="buttons buttons--no-squash"
                style={{
                  marginTop: "1rem",
                }}
              >
                <button
                  className="button button--secondary"
                  disabled={
                    submitting ||
                    (shouldGetPayment && !isPaymentMethodRequestable)
                  }
                  type="submit"
                >
                  {submitting ? <Loading spinner small /> : nextButtonText}
                </button>
                <button
                  className="button button--primary"
                  disabled={submitting}
                  onClick={onGoBack}
                  type="button"
                >
                  Back
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

ConfirmNewPlan.displayName = "ConfirmNewSubscription";

interface Props extends ReturnType<typeof mapStateToProps> {
  addOnPrice?: number;
  braintreePlan: IBraintreePlanWithClientRequestToken;
  dispatch: Function;
  newSubscriptionType: PremiumSubscriptionType;
  onGoBack: (_?: any) => void;
  onSubmit: (
    nextStep: PurchaseSubscriptionWizardStep,
    message?: string
  ) => void;
}

const mapStateToProps = (
  state: IAppState
): {
  hasSubscription: boolean;
  subscriptionData?: ISubscriptionData;
  subscriptionType?: PremiumSubscriptionType;
} => ({
  hasSubscription: state.settings.subscriptions.hasBraintreeSubscription,
  subscriptionData: state.subscription.data,
  subscriptionType: state.settings.subscriptions.subscriptionType,
});

export default connect(mapStateToProps)(ConfirmNewPlan);
