import createCachedSelector from 're-reselect';
import { IAppState } from 'types/app';

interface Props {
  itemId: number | undefined,
}

const getMyself = ({ myself }: IAppState) => myself;
const getItemId = (_state: IAppState, { itemId }: Props) => itemId;
const cacheKey = (state: IAppState, props: Props) => `${getItemId(state, props)}`;

const output = (
  myself: ReturnType<typeof getMyself>,
  itemId: ReturnType<typeof getItemId>,
) => myself.qualities.find(q => q.id === itemId);

export default createCachedSelector(getMyself, getItemId, output)(cacheKey);
