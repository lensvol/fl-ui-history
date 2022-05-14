import {
  IBraintreePurchaseFateRequest,
  ICreateBraintreeSubscriptionRequest,
  IPaymentService,
} from 'types/payment';
import BaseService from './BaseService';

export default class PaymentService extends BaseService implements IPaymentService {
  /**
   * Select Currency
   * @return {Promise}
   */
  selectCurrency = (currencyCode: string) => {
    const config = {
      url: `/nex/braintreenexoptions/${currencyCode}`,
    };
    return this.doRequest(config);
  };

  fetchPlan = (currencyCode: string) => {
    const config = {
      url: `/nex/braintreesubscriptionoptions/${currencyCode}`,
    };
    return this.doRequest(config);
  };

  /**
   * Fetch plans
   * @return {Promise}
   */
  fetchPlans = () => {
    const config = {
      url: '/nex/braintreesubscriptionoptions',
    };
    return this.doRequest(config);
  };


  /**
   * Purchase with braintree
   * @return {Promise}
   */
  purchaseWithBraintree = (data: IBraintreePurchaseFateRequest) => {
    const config = {
      data,
      method: 'post',
      url: '/nex/purchasenexbraintreepaymentmethod',
      // Force a 500 error by directing the request to purchasenexbraintreepaymentmethoderror
      // url: '/nex/purchasenexbraintreepaymentmethoderror',
    };
    return this.doRequest<{ isSuccess: boolean, message?: string | undefined }>(config);
  };


  /**
   * Purchase subscription plan with braintree
   * @param  {Object} data
   * @return {Promise}
   */
  purchasePlan = (data: ICreateBraintreeSubscriptionRequest) => {
    const config = {
      data,
      method: 'post',
      url: '/nex/createbraintreesubscription',
      // url: '/nex/createbraintreesubscriptionerror',
    };
    return this.doRequest(config);
  };
}
