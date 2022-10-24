import BaseService, { Either } from "./BaseMonadicService";

export type FetchCategoriesResponse = {
  thing: string[];
  status: string[];
};

export interface ICategoriesService {
  fetchCategories: () => Promise<Either<FetchCategoriesResponse>>;
}

export default class CategoriesService
  extends BaseService
  implements ICategoriesService
{
  fetchCategories = async () => {
    const config = {
      method: "GET",
      url: "/app/categories",
    };
    return this.doRequest<FetchCategoriesResponse>(config);
  };
}
