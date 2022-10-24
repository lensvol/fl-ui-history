import { createSelector } from "reselect";
import { IMyselfState } from "types/myself";
import { IQuality } from "types/qualities";

export const LICENCE_TO_AMEND_YOUR_FACE_ID = 126872;

const getQualities = ({
  myself: { qualities },
}: {
  myself: Pick<IMyselfState, "qualities">;
}) => qualities;

const outputFunc = (qualities: IQuality[]) =>
  qualities.findIndex(
    (q) => q.id === LICENCE_TO_AMEND_YOUR_FACE_ID && q.effectiveLevel > 0
  ) >= 0;

export default createSelector(getQualities, outputFunc);
