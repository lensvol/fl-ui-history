import {
  ISubscriptionService,
  PremiumSubscriptionType,
} from "types/subscription";
import BaseService from "./BaseService";

export default class SubscriptionService
  extends BaseService
  implements ISubscriptionService
{
  /**
   * Fetch
   * @return {Promise}
   */
  fetchSubscription = () => {
    const config = {
      method: "get",
      url: "/fate/hassubscription",
    };
    return this.doRequest(config);
  };

  /**
   * Modify braintree subscription
   * @type {Object}
   */
  modifyBraintreeSubscription = (subscriptionType: PremiumSubscriptionType) => {
    const config = {
      url: "/nex/modifybraintreesubscription",
      method: "post",
      data: {
        subscriptionType,
      },
    };

    return this.doRequest(config);
  };
}
