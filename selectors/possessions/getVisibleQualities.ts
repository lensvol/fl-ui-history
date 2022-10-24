import { EXCLUDED_QUALITY_IDS } from "constants/possessions";
import createCachedSelector from "re-reselect";
import { IAppState } from "types/app";
import { IQuality } from "types/qualities";

import sortByHimble from "utils/sortByHimble";
import { normalize } from "utils/stringFunctions";

interface Props {
  filterString: string;
  qualities: number[];
  name: string;
}

function getFilterString(_state: IAppState, { filterString }: Props): string {
  return filterString;
}

function getQualities({ myself: { qualities } }: IAppState): IQuality[] {
  return qualities;
}

const getQualityIds = (_state: IAppState, { qualities }: Props) => qualities;

const cacheKey = (_state: IAppState, { name }: Props) => name;

const isExcluded = (quality: IQuality) =>
  EXCLUDED_QUALITY_IDS.indexOf(quality.id) >= 0;

function outputFn(filterString: string, qualities: IQuality[], ids: number[]) {
  const matchingQualities: IQuality[] = getMatchingQualities(qualities)(ids);

  return [...matchingQualities]
    .filter((q) => !isExcluded(q))
    .filter((q) => normalize(q.name).indexOf(normalize(filterString)) >= 0)
    .filter((q) => q.level > 0)
    .sort(sortByHimble);
}

export function getMatchingQualities(
  qualities: IQuality[]
): (ids: number[]) => IQuality[] {
  return (ids: number[]) =>
    ids
      .map((id) => qualities.find((q) => q.id === id))
      .filter(isDefinedQuality);
}

function isDefinedQuality(q: IQuality | undefined): q is IQuality {
  return q !== undefined;
}

export default createCachedSelector(
  getFilterString,
  getQualities,
  getQualityIds,
  outputFn
)(cacheKey);
