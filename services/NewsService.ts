import BaseService, { Either } from "./BaseMonadicService";

export interface INewsService {
  fetch: () => Promise<Either<NewsResponse>>;
}

export type NewsResponse = {
  heading: string;
  html: string;
  atDateTime: string;
  image: string;
  id: number;
};

export default class NewsService extends BaseService implements INewsService {
  /**
   * Fetch
   * @return {Promise} [description]
   */
  fetch = () => {
    const config = {
      url: "/news",
    };
    return this.doRequest<NewsResponse>(config);
  };
}
