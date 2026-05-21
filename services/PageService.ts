import BaseService, { Either } from "services/BaseMonadicService";

export type PageName =
  | "ai-statement"
  | "credits"
  | "help"
  | "privacy"
  | "termsandconditions";

export interface FetchPageResponse {
  name: string;
  text: string;
}

export interface IPageService {
  fetch: (name: PageName) => Promise<Either<FetchPageResponse>>;
}

export default class PageService extends BaseService implements IPageService {
  fetch(name: PageName): Promise<Either<FetchPageResponse>> {
    const config = {
      method: "get",
      url: `/page/${name}`,
    };

    return this.doRequest(config);
  }
}
