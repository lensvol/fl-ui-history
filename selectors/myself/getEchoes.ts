import { createSelector } from "reselect";
import { IAppState } from "types/app";

export const PENNY = "Penny";

const getQualities = ({ myself: { qualities } }: IAppState) => qualities;

const output = (qualities: ReturnType<typeof getQualities>) => {
  const penniesQuality = qualities.find((q) => q.name === PENNY);
  if (!penniesQuality) {
    return 0;
  }
  return penniesQuality.level / 100;
};

export default createSelector([getQualities], output);
