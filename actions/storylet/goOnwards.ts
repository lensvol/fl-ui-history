import { processMessages } from 'actions/app';
import {
  clearCache as clearCardCache,
  fetch as fetchCards,
} from 'actions/cards';
import { handleVersionMismatch } from 'actions/versionSync';
import * as phases from 'constants/phases';

import fetchAvailable from 'actions/storylet/fetchAvailable';
import { VersionMismatch } from 'services/BaseService';
import { IAppState } from 'types/app';

export default goOnwards();

export function goOnwards() {
  return () => async (dispatch: Function, getState: () => IAppState) => {
    try {
      // Get the character's new place in the storylet loop
      const storylet = await dispatch(fetchAvailable({ setIsFetching: false }));

      // If we received messages from the storylet data, then process them now
      // (this does not need to wait until we have new opp card info)
      if (storylet && storylet.messages) {
        dispatch(processMessages(storylet.messages));
      }

      // Did opportunity card eligibility change while we were processing previous messages?
      const { cards: { shouldFetch } } = getState();

      // If we are moving into the Available phase, then fetch cards too.
      // We only want to fetch cards if we're moving into "Available" because
      // there's a chance that some linked events can trigger us being put into
      // the In phase when we draw a card.
      if (shouldFetch && storylet && storylet.phase === phases.AVAILABLE) {
        // First clear the state
        dispatch(clearCardCache());
        // Then request an update
        await dispatch(fetchCards());
      }
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      console.error(error);
    }
  };
}