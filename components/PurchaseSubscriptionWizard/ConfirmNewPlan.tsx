import React, { useCallback, useState } from "react";
import { connect } from "react-redux";

import { isDowngradedSubscription } from "actions/fate/subscriptions";
import { modifyBraintreeSubscription } from "actions/subscription";

import Loading from "components/Loading";
import { PurchaseSubscriptionWizardStep } from "components/PurchaseSubscriptionWizard";

import useIsMounted from "hooks/useIsMounted";

import { IAppState } from "types/app";
import { ISubscriptionData, PremiumSubscriptionType } from "types/subscription";

export function ConfirmNewPlan({
  addOnPrice,
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

  const doSubmit = useCallback(
    async (evt: any) => {
      setSubmitting(true);
      onSubmit(evt);

      try {
        const data = await dispatch(
          modifyBraintreeSubscription({
            modifyInBackground: true,
            subscriptionType: newSubscriptionType,
          })
        );

        if (isMounted.current) {
          setSubmitting(false);
        }

        if (data.isSuccess) {
          onSubmit(
            evt,
            PurchaseSubscriptionWizardStep.PaymentSuccess,
            data.message
          );
        } else {
          onSubmit(
            evt,
            PurchaseSubscriptionWizardStep.PaymentFailure,
            data.message
          );
        }
      } catch (error) {
        const err: any = error;

        onSubmit(
          evt,
          PurchaseSubscriptionWizardStep.PaymentFailure,
          err?.response?.message ?? err?.message
        );
      }
    },
    [dispatch, isMounted, newSubscriptionType, onSubmit]
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

  const didRecentlyDowngrade = isDowngradedSubscription(
    hasSubscription,
    subscriptionType
  );
  const amountChargedText = didRecentlyDowngrade
    ? "No charge"
    : (addOnPrice ?? "") + " " + (subscriptionData?.currencyIsoCode ?? "");

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

        <div
          className="buttons buttons--no-squash"
          style={{
            marginTop: "1rem",
          }}
        >
          <button
            className="button button--secondary"
            disabled={submitting}
            onClick={doSubmit}
            type="button"
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
      </div>
    </>
  );
}

ConfirmNewPlan.displayName = "ConfirmNewSubscription";

interface Props extends ReturnType<typeof mapStateToProps> {
  addOnPrice?: number;
  dispatch: Function;
  newSubscriptionType: PremiumSubscriptionType;
  onGoBack: (_?: any) => void;
  onSubmit: (
    _?: any,
    nextStep?: PurchaseSubscriptionWizardStep,
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
