/* eslint-disable import/prefer-default-export */

import { ThunkDispatch } from 'redux-thunk';
import {
  Failure,
  Success,
} from 'services/BaseMonadicService';
import PageService, {
  FetchPageResponse,
  IPageService,
  PageName,
} from 'services/PageService';

const service: IPageService = new PageService();

export function fetchPage(name: PageName) {
  return async (_dispatch: ThunkDispatch<any, any, any>) => {
    const response: Success<FetchPageResponse> | Failure = await service.fetch(name);
    return response;
  };
}