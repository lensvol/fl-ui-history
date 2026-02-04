import BaseService, { Either } from "services/BaseMonadicService";

export interface INewsService {
  fetch: () => Promise<Either<NewsResponse>>;

  fetchAll: () => Promise<Either<NewsResponse[]>>;
}

export type NewsResponse = {
  heading: string;
  html: string;
  atDateTime: string;
  image: string;
  id: number;
};

export default class NewsService extends BaseService implements INewsService {
  fetch = () => {
    const config = {
      method: "get",
      url: "/news",
    };

    return this.doRequest<NewsResponse>(config);
  };

  fetchAll = () => {
    const config = {
      method: "get",
      url: "/news/all",
    };

    return this.doRequest<NewsResponse[]>(config);
  };
}
