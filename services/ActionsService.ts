import { IActionsService, FetchActionsResponse } from 'types/actions';
import BaseService, { Either } from './BaseMonadicService';

export default class ActionsService extends BaseService implements IActionsService {
  fetchActions: () => Promise<Either<FetchActionsResponse>> = () => {
    const config = {
      url: '/character/actions',
    };
    return this.doRequest<FetchActionsResponse>(config);
  }
}