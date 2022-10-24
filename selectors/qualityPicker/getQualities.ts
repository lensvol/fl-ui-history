import createCachedSelector from "re-reselect";
import { IAppState } from "types/app";

interface Props {
  nature: string;
}

const getMyself = ({ myself }: IAppState) => myself;
const getNature = (_state: IAppState, props: Props) => props.nature;

const cacheKey = getNature;

const outputFunc = (
  myself: ReturnType<typeof getMyself>,
  nature: ReturnType<typeof getNature>
) =>
  myself.qualities
    .filter((q) => q.nature === nature) // filter by nature (Thing/Status)
    .map((q) => ({
      ...q,
      level: q.effectiveLevel, // use effectiveLevel to show modified quality level
    }));

export default createCachedSelector(getMyself, getNature, outputFunc)(cacheKey);
