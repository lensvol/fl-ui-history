import { ISubscriptionService, ModifyOptions } from "types/subscription";
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
  modifyBraintreeSubscription = (options: ModifyOptions) => {
    const config = {
      url: "/nex/modifybraintreesubscription",
      method: "post",
      data: {
        deviceData: options.deviceData,
        nonce: options.nonce,
        paymentType: options.paymentType,
        subscriptionType: options.subscriptionType,
      },
    };

    return this.doRequest(config);
  };
}
