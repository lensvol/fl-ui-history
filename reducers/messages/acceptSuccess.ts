import { AcceptSuccess } from 'actions/messages/accept';
import excludeById from './excludeById';
import sortByDate from './sortByDate';
import { IMessagesState } from 'types/messages';

export default function acceptSuccess(state: IMessagesState, action: AcceptSuccess) {
  const { payload } = action;
  return {
    ...state,
    isRequesting: false,
    // Add the newly-accepted message to feed messages
    feedMessages: [payload.content, ...state.feedMessages].sort(sortByDate).reverse(),
    // Remove it from interactions
    interactions: excludeById(state.interactions, payload.id).sort(sortByDate).reverse(),
  };
}
