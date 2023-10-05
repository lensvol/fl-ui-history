import React, { CSSProperties } from "react";

import { useFeature } from "flagged";

import {
  isRecentlyCancelledSubscription,
  subscriptionName,
} from "actions/fate/subscriptions";

import SubscriptionBenefits from "components/PurchaseSubscriptionWizard/SubscriptionBenefits";

import { FEATURE_ENHANCED_EF } from "features/feature-flags";

import { PremiumSubscriptionType } from "types/subscription";

interface Props {
  amountString?: string | undefined;
  hasSubscription: boolean;
  isEnhanced: boolean;
  renewDate?: string;
  subscriptionType?: PremiumSubscriptionType;
}

export default function Header({
  amountString,
  hasSubscription,
  isEnhanced,
  renewDate,
  subscriptionType,
}: Props) {
  const supportsEnhancedEF = useFeature(FEATURE_ENHANCED_EF);
  const paragraphStyle: CSSProperties = {
    padding: "8px 0",
  };

  if (supportsEnhancedEF) {
    paragraphStyle.fontStyle = "italic";
  }

  const formattedRenewDate = new Date(renewDate ?? "").toLocaleDateString(
    "en-gb",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const isCurrentlyRestoringSubscription = isRecentlyCancelledSubscription(
    hasSubscription,
    subscriptionType
  );
  const theAmountChosen = amountString ?? "the amount chosen below";

  return (
    <>
      {supportsEnhancedEF && (
        <>
          <h1 className="media__heading heading heading--2 fate-header">
            Create a New Subscription
          </h1>
          {!amountString && <SubscriptionBenefits orientation="vertical" />}
        </>
      )}

      <p style={paragraphStyle}>
        {isCurrentlyRestoringSubscription ? (
          <>
            Your previously cancelled {subscriptionName(subscriptionType)}{" "}
            remains in effect.{" "}
            {subscriptionType === "ExceptionalFriendship" && isEnhanced ? (
              <>
                You will be charged today to upgrade to an Enhanced Exceptional
                Friendship. Starting on {formattedRenewDate}, you will be
                charged {theAmountChosen} to keep it renewed.
              </>
            ) : (
              <>
                {subscriptionType === "EnhancedExceptionalFriendship" &&
                !isEnhanced ? (
                  <>
                    Starting on {formattedRenewDate}, you will be charged{" "}
                    {theAmountChosen} to keep your Exceptional Friendship
                    renewed.
                  </>
                ) : (
                  <>
                    Restoring it will renew your{" "}
                    {supportsEnhancedEF && isEnhanced && "Enhanced"} Exceptional
                    Friendship on {formattedRenewDate}, and charge{" "}
                    {theAmountChosen} to your chosen payment method every month.
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            Creating a subscription will automatically renew your{" "}
            {supportsEnhancedEF && isEnhanced && "Enhanced"} Exceptional
            Friendship every month and charge {theAmountChosen} to your chosen
            payment method.
          </>
        )}
      </p>
    </>
  );
}
