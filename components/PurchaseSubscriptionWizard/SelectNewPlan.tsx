import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";

import { isDowngradedSubscription } from "actions/fate/subscriptions";

import Loading from "components/Loading";
import SubscriptionBenefits from "components/PurchaseSubscriptionWizard/SubscriptionBenefits";

import PaymentService from "services/PaymentService";

import { IAppState } from "types/app";
import {
  IBraintreeAddOn,
  IBraintreePlan,
  IPaymentService,
} from "types/payment";
import { ISubscriptionData, PremiumSubscriptionType } from "types/subscription";

export function SelectNewPlan({
  hasSubscription,
  onCancel,
  onSubmit,
  onSubscriptionTypeChanged,
  setAddOnPrice,
  subscriptionData,
  subscriptionType,
}: Props) {
  const isEnhanced = subscriptionType === "EnhancedExceptionalFriendship";

  const [loading, setLoading] = useState(true);

  const [plans, setPlans] = useState<IBraintreePlan[]>([]);
  const [addOn, setAddOn] = useState<IBraintreeAddOn | undefined>(undefined);
  const [selectedSubscriptionType, setSelectedSubscriptionType] =
    useState<PremiumSubscriptionType>("None");

  const doChangeSubscriptionType = useCallback(
    (newSubscriptionType: PremiumSubscriptionType) => {
      setSelectedSubscriptionType(newSubscriptionType);
      onSubscriptionTypeChanged(newSubscriptionType);
    },
    [onSubscriptionTypeChanged]
  );

  useEffect(() => {
    if (plans.length > 0) {
      return;
    }

    fetchPlans();

    async function fetchPlans() {
      setLoading(true);

      const paymentService: IPaymentService = new PaymentService();

      const { data: planData } = await paymentService.fetchPlans();

      setPlans(planData.plans);

      const currentPlan = planData.plans.find(
        (plan) => plan.currencyIsoCode === subscriptionData?.currencyIsoCode
      );
      const currentAddOn = currentPlan?.addOns?.[0];

      setAddOn(currentAddOn);
      setAddOnPrice(currentAddOn?.amount);

      const currentSubscriptionType = isEnhanced
        ? "ExceptionalFriendship"
        : "EnhancedExceptionalFriendship";

      doChangeSubscriptionType(currentSubscriptionType);

      setLoading(false);
    }
  }, [
    doChangeSubscriptionType,
    isEnhanced,
    plans,
    setAddOnPrice,
    subscriptionData,
  ]);

  const handleChangeSubscriptionType = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      const newSubscriptionType = evt.target.value as PremiumSubscriptionType;

      doChangeSubscriptionType(newSubscriptionType);
    },
    [doChangeSubscriptionType]
  );

  const formattedRenewDate = new Date(
    subscriptionData?.renewDate ?? ""
  ).toLocaleDateString("en-gb", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const didRecentlyDowngrade = isDowngradedSubscription(
    hasSubscription,
    subscriptionType
  );

  if (loading) {
    return <Loading spinner />;
  }

  return (
    <>
      <h1 className="media__heading heading heading--2 fate-header">
        Manage Subscriptions
      </h1>

      <SubscriptionBenefits orientation="vertical" />

      <p
        style={{
          fontStyle: "italic",
          padding: "8px 0",
        }}
      >
        {selectedSubscriptionType === "EnhancedExceptionalFriendship" && (
          <>
            {didRecentlyDowngrade ? (
              <>
                Your previous Enhanced benefits remain in effect. Enhancing your
                subscription again will allow you to retain those benefits
                beyond the end of the current billing period. Your monthly
                billing date will remain the same. From the next scheduled
                billing payment date you will be charged the total cost of the
                Standard and Enhanced subscriptions.
              </>
            ) : (
              <>
                Enhancing a subscription will immediately charge the Enhanced
                price below to your chosen payment method and confer Enhanced
                benefits to your account for the remainder of the present
                subscription month. Your monthly billing date will remain the
                same. From the next scheduled billing payment date you will be
                charged the total cost of the Standard and Enhanced
                subscriptions.
              </>
            )}
          </>
        )}
        {selectedSubscriptionType === "ExceptionalFriendship" && (
          <>
            Downgrading a subscription will reduce your next monthly billing
            amount to the Standard price, and remove Enhanced member benefits
            from the same date. You can continue to make use of Enhanced
            benefits for the remainder of your present subscription month.
          </>
        )}
        {selectedSubscriptionType === "None" && (
          <>
            If you cancel your subscription you will retain all your member
            benefits for the remainder of your current billing period.
          </>
        )}
      </p>

      <div className="ef-subscription-panel">
        <div className="ef-subscription-options">
          <div className="ef-subscription-lede">Current subscription type:</div>
          <div className="ef-subscription-detail">
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
          <div className="ef-subscription-lede">Choose action:</div>
          <div className="ef-subscription-detail">
            <select
              id="subscriptionSelection"
              name="subscriptionSelection"
              onChange={handleChangeSubscriptionType}
              value={selectedSubscriptionType}
            >
              {!isEnhanced && (
                <>
                  <option
                    key="EnhancedExceptionalFriendship"
                    value="EnhancedExceptionalFriendship"
                  >
                    Enhance Subscription: +{addOn?.amount}{" "}
                    {subscriptionData?.currencyIsoCode}
                  </option>
                </>
              )}
              {isEnhanced && (
                <>
                  <option
                    key="ExceptionalFriendship"
                    value="ExceptionalFriendship"
                  >
                    Downgrade Subscription
                  </option>
                </>
              )}
              <>
                <option key="None" value="None">
                  Cancel Subscription
                </option>
              </>
            </select>
          </div>
          <div className="ef-subscription-lede">New subscription type:</div>
          <div className="ef-subscription-detail">
            {selectedSubscriptionType === "EnhancedExceptionalFriendship" && (
              <>
                <span className="enhanced-text">Enhanced</span> (
                {(subscriptionData?.price ?? 0) + (addOn?.amount ?? 0)}{" "}
                {subscriptionData?.currencyIsoCode}/month)
              </>
            )}
            {selectedSubscriptionType === "ExceptionalFriendship" && (
              <>
                Standard ({subscriptionData?.price}{" "}
                {subscriptionData?.currencyIsoCode}/month)
              </>
            )}
            {selectedSubscriptionType === "None" && <>None</>}
          </div>
          <div className="lede"></div>
          <div
            className="ef-subscription-detail"
            style={{
              padding: "1rem 0",
            }}
          >
            {selectedSubscriptionType === "None" ? (
              <>Subscription expiration date:</>
            ) : (
              <>Next monthly payment:</>
            )}{" "}
            {formattedRenewDate}
          </div>
        </div>

        <div className="buttons buttons--no-squash">
          <button
            className="button button--secondary"
            onClick={onSubmit}
            type="button"
          >
            Next
          </button>
          <button
            className="button button--primary"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

SelectNewPlan.displayName = "SelectNewSubscription";

interface Props extends ReturnType<typeof mapStateToProps> {
  onCancel: (_?: any) => void;
  onSubmit: (_?: any) => void;
  onSubscriptionTypeChanged: (
    newSubscriptionType: PremiumSubscriptionType
  ) => void;
  setAddOnPrice: (newAddOnPrice?: number) => void;
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

export default connect(mapStateToProps)(SelectNewPlan);
