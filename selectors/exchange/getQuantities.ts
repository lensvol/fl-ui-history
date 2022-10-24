import { createSelector } from "reselect";
import { IAppState } from "types/app";
import { IQuality } from "types/qualities";

const getQualities = ({ myself: { qualities = [] } }: IAppState) => qualities;

const outputFunc = (qualities: IQuality[]) => {
  // Build a map of possession and equippable IDs to their quantity
  const reduceFn = (acc: { [key: number]: number }, item: IQuality) => ({
    ...acc,
    [item.id]: item.level,
  });
  return qualities.reduce(reduceFn, {});
};

export default createSelector([getQualities], outputFunc);
