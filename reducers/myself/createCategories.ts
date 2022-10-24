import { IQuality } from "types/qualities";

type CreateCategoriesArg = {
  name: string;
  categories: string[];
  possessions: IQuality[];
}[];

type CreateCategoriesReturnType = {
  name: string;
  qualities: number[];
  categories: string[];
}[];

export default function createCategories(
  possessions: CreateCategoriesArg
): CreateCategoriesReturnType {
  return possessions.map((category) => ({
    categories: category.categories,
    name: category.name,
    qualities: category.possessions.map(({ id }) => id),
  }));
}
