import BaseService, { Either } from "services/BaseMonadicService";

export interface INewsService {
  fetch: () => Promise<Either<NewsResponse>>;

  fetchAll: () => Promise<Either<NewsResponse[]>>;

  fetchPatchNoteNavigation: () => Promise<Either<number[]>>;

  fetchPatchNotes: (year: number) => Promise<Either<PatchNoteResponse[]>>;
}

export type NewsResponse = {
  heading: string;
  html: string;
  atDateTime: string;
  image: string;
  id: number;
};

export type PatchNoteResponse = {
  content: string;
  title: string;
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

  fetchPatchNoteNavigation = () => {
    const config = {
      method: "get",
      url: "/patchnotes/years",
    };

    return this.doRequest<number[]>(config);
  };

  fetchPatchNotes = (year: number) => {
    const config = {
      method: "get",
      url: `/patchnotes/year/${year}`,
    };

    return this.doRequest<PatchNoteResponse[]>(config);
  };
}
