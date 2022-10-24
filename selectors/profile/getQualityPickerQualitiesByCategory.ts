import createCachedSelector from "re-reselect";
import { IAppState } from "types/app";
import { IQuality } from "types/qualities";

interface Props {
  data: IQuality;
}

const getCategory = (_state: IAppState, { data: { category } }: Props) =>
  category;
const getQualities = ({ myself: { qualities } }: IAppState) => qualities;
const cacheKey = getCategory;

const output = (
  category: ReturnType<typeof getCategory>,
  qualities: ReturnType<typeof getQualities>
) => qualities.filter((q) => q.category === category);

export default createCachedSelector(
  getCategory,
  getQualities,
  output
)(cacheKey);
