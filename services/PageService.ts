import BaseService, { Either } from "./BaseMonadicService";

export type PageName = "help" | "termsandconditions" | "privacy" | "credits";

export interface FetchPageResponse {
  name: string;
  text: string;
}

export interface IPageService {
  fetch: (name: PageName) => Promise<Either<FetchPageResponse>>;
}

export default class PageService extends BaseService implements IPageService {
  fetch(name: PageName): Promise<Either<FetchPageResponse>> {
    return this.doRequest({ url: `/page/${name}` });
  }
}
