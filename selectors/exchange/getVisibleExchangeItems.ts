import { createSelector } from "reselect";
import getQuantities from "selectors/exchange/getQuantities";
import { IAppState } from "types/app";
import { IAvailability, IShop } from "types/exchange";

function getActiveStore({ exchange }: IAppState) {
  return exchange.activeStore;
}

function getFilterString(
  state: IAppState,
  props: { filterString: string }
): string {
  return props.filterString;
}

function getShops(state: IAppState): { [key: string]: IShop } {
  return state.exchange.shops;
}

// const inputFuncs = [getActiveStore, getFilterString, getQuantities, getShops];

const outputFunc = (
  activeStore: ReturnType<typeof getActiveStore>,
  filterString: ReturnType<typeof getFilterString>,
  quantities: ReturnType<typeof getQuantities>,
  shops: ReturnType<typeof getShops>
) => {
  const isNonZeroIfSelling = makeIsNonZeroIfSelling({
    activeStore,
    quantities,
  });
  // If we have a filterString then we want to filter out non-matches
  const matchesFilterString = makeNameMatchesFilterString({ filterString });

  // Ensure we have an array
  const items = (shops[activeStore] || { items: [] }).items || [];

  // Apply the filters
  return items.filter(isNonZeroIfSelling).filter(matchesFilterString);
};

export function makeIsNonZeroIfSelling({
  activeStore,
  quantities,
}: {
  activeStore: ReturnType<typeof getActiveStore>;
  quantities: ReturnType<typeof getQuantities>;
}) {
  // If activeStore is null, then we want to filter out items whose quantities are at 0
  return (item: IAvailability) => {
    const qualityId = item.availability.quality.id;
    return activeStore !== null || quantities[qualityId] > 0;
  };
}

export function makeNameMatchesFilterString({
  filterString,
}: {
  filterString: string;
}) {
  return (item: IAvailability) => {
    const qualityName = item.availability.quality.name;
    return qualityName.toLowerCase().indexOf(filterString.toLowerCase()) >= 0;
  };
}

// const inputFuncs = [getActiveStore, getFilterString, getQuantities, getShops];
export default createSelector(
  [getActiveStore, getFilterString, getQuantities, getShops],
  outputFunc
);
