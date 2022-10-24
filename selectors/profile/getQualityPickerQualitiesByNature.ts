import createCachedSelector from "re-reselect";
import { IAppState } from "types/app";

interface Props {
  data: { nature: string };
}

const getNature = (_state: IAppState, { data: { nature } }: Props) => nature;
const getQualities = ({ myself: { qualities } }: IAppState) => qualities;
const cacheKey = getNature;

const output = (
  nature: ReturnType<typeof getNature>,
  qualities: ReturnType<typeof getQualities>
) => qualities.filter((q) => q.nature === nature);

export default createCachedSelector(getNature, getQualities, output)(cacheKey);
