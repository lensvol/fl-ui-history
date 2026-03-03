import excludeById from "reducers/messages/excludeById";

import { IMessagesState } from "types/messages";

export default function updateAndExclude(
  state: IMessagesState,
  id: number,
  progress: any
) {
  return {
    ...state,
    ...progress,
    feedMessages: excludeById(state.feedMessages, id),
    interactions: excludeById(state.interactions, id),
    invitationId: state.invitationId === id ? undefined : id,
  };
}
