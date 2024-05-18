import HasSubscriptionContent from "components/Account/Subscriptions/HasSubscriptionContent";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";

import { fetch as fetchSettings } from "actions/settings";

import PurchaseSubscriptionModal from "components/PurchaseSubscriptionModal";

import { IAppState } from "types/app";

function Subscriptions({
  data,
  hasBraintreeSubscription,
  renewDate,
  subscriptionType,
}: Props) {
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

const mapStateToProps = ({
  settings: {
    data,
    subscriptions: { hasBraintreeSubscription, subscriptionType },
  },
  subscription: { data: subscriptionData },
}: IAppState) => ({
  data,
  hasBraintreeSubscription,
  renewDate: subscriptionData?.renewDate,
  subscriptionType,
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Subscriptions);
