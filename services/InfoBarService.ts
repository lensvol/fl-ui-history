import BaseService, { Either } from './BaseMonadicService';

export type Advert = {
  altText: string,
  image: string,
  url: string,
};

export type Snippet = {
  title: string,
  description: string,
  id: number,
  image: string,
};

export type FetchSnippetsResponse = Snippet[];

export type GetSupportingDataResponse = {
  advert: Advert,
  snippets: Snippet[],
};

export interface IInfoBarService {
  fetchSnippets: () => Promise<Either<FetchSnippetsResponse>>,
  getSupportingData: () => Promise<Either<GetSupportingDataResponse>>,
}

export default class InfoBarService extends BaseService implements IInfoBarService {
  /**
   * Fetch Snippets
   * @return {Promise}
   */
  fetchSnippets = () => {
    const config = {
      url: '/infobar/snippets',
    };
    return this.doRequest<FetchSnippetsResponse>(config);
  };

  getSupportingData = () => {
    const config = {
      url: '/infobar',
    };
    return this.doRequest<GetSupportingDataResponse>(config);
  };
}
