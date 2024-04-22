import { createSelector } from "reselect";
import { IAppState } from "types/app";

const getShops = ({ exchange }: IAppState) => exchange.shops;

const outputFunc = (shops: ReturnType<typeof getShops>) => {
  return [...Object.keys(shops)]
    .map((k) => shops[k])
    .sort(
      (a: { ordering: number | null }, b: { ordering: number | null }) =>
        (a.ordering ?? -1) - (b.ordering ?? -1)
    );
};

export default createSelector([getShops], outputFunc);
