import { IQuality } from "types/qualities";

type CreateCategoriesArg = {
  name: string;
  categories: string[];
  possessions: IQuality[];
  image?: string;
}[];

type CreateCategoriesReturnType = {
  name: string;
  qualities: number[];
  categories: string[];
  image?: string;
}[];

export default function createCategories(
  possessions: CreateCategoriesArg
): CreateCategoriesReturnType {
  return possessions.map((category) => ({
    categories: category.categories,
    name: category.name,
    qualities: category.possessions.map(({ id }) => id),
    image: category.image,
  }));
}
