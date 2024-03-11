import {
  CLIENT_BECAME_OUTDATED,
  VERSION_MISMATCH_MODAL_DISMISSED,
} from "actiontypes/versionSync";

import Config from "configuration";

import { IVersionSyncState } from "types/versionSync";

const INITIAL_STATE: IVersionSyncState = {
  isClientOutdated: false,
  isModalDismissed: false,
  latestVersion: Config.version,
};

export default function reducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case CLIENT_BECAME_OUTDATED:
      return {
        isClientOutdated: true,
        isModalDismissed: false, // Force the user to see the modal again
        latestVersion: action.payload.latestVersion,
      };

    case VERSION_MISMATCH_MODAL_DISMISSED:
      return {
        ...state,
        isModalDismissed: true,
      };

    default:
      return state;
  }
}
