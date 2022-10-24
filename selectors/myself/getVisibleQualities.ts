import createCachedSelector from "re-reselect";
import { IAppState } from "types/app";
import { IQuality } from "types/qualities";

import { normalize } from "utils/stringFunctions";
import sortContacts from "./sortContacts";
import sortMainAttributes from "./sortMainAttributes";

interface Props {
  filterString: string;
  name: string;
}

const getCategories = ({ myself: { categories } }: IAppState) => categories;
const getQualities = ({ myself: { qualities } }: IAppState) => qualities;
const getFilterString = (_state: IAppState, { filterString }: Props) =>
  filterString;

const getName = (_state: IAppState, props: Props) => props.name;
const cacheKey = (state: IAppState, props: Props) => `${getName(state, props)}`;

const outputFunc = (
  categories: ReturnType<typeof getCategories>,
  qualities: ReturnType<typeof getQualities>,
  filterString: ReturnType<typeof getFilterString>,
  name: ReturnType<typeof getName>
) => {
  const category = categories.find((c) => c.name === name);
  const categoryQualities =
    category?.qualities
      .map(qualityIdToQuality({ qualities }))
      .filter((q) => q !== undefined)
      .map((q) => q!) ?? [];
  // Filter by name and level, then sort by main attribute and Contacts special-case stuff
  return [...categoryQualities]
    .filter((q) => normalize(q.name).indexOf(normalize(filterString)) >= 0)
    .filter(isNonZero)
    .sort(sortMainAttributes)
    .sort(sortContacts);
};

export function qualityIdToQuality({ qualities }: { qualities: IQuality[] }) {
  return (id: number) => qualities.find((q) => q.id === id);
}

export function isNonZero(q: IQuality) {
  return q.effectiveLevel > 0;
}

export default createCachedSelector(
  getCategories,
  getQualities,
  getFilterString,
  getName,
  outputFunc
)(cacheKey);
