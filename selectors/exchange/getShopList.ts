import { createSelector } from 'reselect';
import { IAppState } from 'types/app';

const getShops = ({ exchange }: IAppState) => exchange.shops;

const outputFunc = (shops: ReturnType<typeof getShops>) => {
  return [...Object.keys(shops)]
    .map((k) => shops[k])
    .sort((a: { id: number | null }, b: { id: number | null }) => (a.id ?? 0) - (b.id ?? 0));
};

export default createSelector([getShops], outputFunc);