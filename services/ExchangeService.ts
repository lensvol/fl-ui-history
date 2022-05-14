import {
  IFetchAvailableItemsResponse,
  IFetchExchangeResponse,
  ITransactionRequest,
  ITransactionResponse,
} from 'types/exchange';
import BaseService, { Either } from './BaseMonadicService';

export interface IExchangeService {
  buyItems: (transactionRequest: ITransactionRequest) => Promise<Either<ITransactionResponse>>,
  fetchExchange: () => Promise<Either<IFetchExchangeResponse>>,
  fetchAvailableItems: (shopId?: number | 'null') => Promise<Either<IFetchAvailableItemsResponse>>,
  sellItems: (transactionRequest: ITransactionRequest) => Promise<Either<ITransactionResponse>>,
}

export default class ExchangeService extends BaseService implements IExchangeService {
  /**
   * Fetch
   * @return {Promise}
   */
  fetchExchange = () => {
    const config = {
      url: '/exchange',
    };
    return this.doRequest<IFetchExchangeResponse>(config);
  };

  /**
   * Fetch Available items
   * @param  {Number} shopId
   * @return {Promise}
   */
  fetchAvailableItems = (shopId: number | 'null' = 'null') => {
    const config = {
      url: `/exchange/availabilities?shopId=${shopId}`,
    };
    return this.doRequest<IFetchAvailableItemsResponse>(config);
  };

  /**
   * Fetch
   * @return {Promise}
   */
  sellItems = (transactionRequest: ITransactionRequest) => {
    const config = {
      url: '/exchange/sell',
      method: 'post',
      data: {
        availabilityId: transactionRequest.availabilityId,
        amount: transactionRequest.amount,
      },
    };
    return this.doRequest(config);
  };

  /**
   * Fetch
   * @return {Promise}
   */
  buyItems = (transactionRequest: ITransactionRequest) => {
    const config = {
      url: '/exchange/buy',
      method: 'post',
      data: {
        availabilityId: transactionRequest.availabilityId,
        amount: transactionRequest.amount,
      },
    };
    return this.doRequest(config);
  };
}
