import { ISubscriptionService } from 'types/subscription';
import BaseService from './BaseService';

export default class SubscriptionService extends BaseService implements ISubscriptionService {
  /**
   * Fetch
   * @return {Promise}
   */
  fetchSubscription = () => {
    const config = {
      url: '/fate/hassubscription',
    };
    return this.doRequest(config);
  };


  /**
   * Cancel braintree subscription
   * @type {Object}
   */
  cancelBraintreeSubscription = () => {
    const config = {
      url: '/nex/cancelbraintreesubscription',
      method: 'post',
    };
    return this.doRequest(config);
  };
}
