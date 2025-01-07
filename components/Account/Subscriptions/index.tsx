import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import { fetch as fetchSettings } from "actions/settings";

import HasSubscriptionContent from "components/Account/Subscriptions/HasSubscriptionContent";
import PurchaseSubscriptionModal from "components/PurchaseSubscriptionModal";

import { useAppSelector } from "features/app/store";

export default function Subscriptions() {
  const data = useAppSelector((state) => state.settings.data);
  const hasBraintreeSubscription = useAppSelector(
    (state) => state.settings.subscriptions.hasBraintreeSubscription
  );
  const renewDate = useAppSelector(
    (state) => state.subscription.data?.renewDate
  );
  const subscriptionType = useAppSelector(
    (state) => state.settings.subscriptions.subscriptionType
  );

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!data) {
      dispatch(fetchSettings());
    }
  }, [data, dispatch]);

  return (
    <>
      <div>
        <h2 className="heading heading--2">Subscriptions</h2>
        <HasSubscriptionContent
          onClick={() => setIsSubscriptionModalOpen(true)}
        />
      </div>
      <PurchaseSubscriptionModal
        hasSubscription={hasBraintreeSubscription}
        isOpen={isSubscriptionModalOpen}
        onRequestClose={() => setIsSubscriptionModalOpen(false)}
        renewDate={renewDate}
        subscriptionType={subscriptionType}
      />
    </>
  );
}

Subscriptions.displayName = "Subscriptions";
