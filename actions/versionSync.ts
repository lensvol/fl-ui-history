import {
  CLIENT_BECAME_OUTDATED,
  VERSION_MISMATCH_MODAL_DISMISSED,
} from "actiontypes/versionSync";
import { Dispatch } from "redux";
import { VersionMismatch } from "services/BaseService";

export type ClientBecameOutdated = {
  type: typeof CLIENT_BECAME_OUTDATED;
  payload: {
    latestVersion: number | string;
  };
};

export function clientBecameOutdated(
  arg: string | VersionMismatch
): ClientBecameOutdated {
  if (arg instanceof VersionMismatch) {
    return {
      type: CLIENT_BECAME_OUTDATED,
      payload: { latestVersion: arg.latestVersion },
    };
  }
  return {
    type: CLIENT_BECAME_OUTDATED,
    payload: { latestVersion: arg as string },
  };
}

export function dismissVersionMismatchModal() {
  return (dispatch: Dispatch) =>
    dispatch({ type: VERSION_MISMATCH_MODAL_DISMISSED });
}

export function handleVersionMismatch(arg: string | VersionMismatch) {
  return (dispatch: Dispatch) => {
    dispatch(clientBecameOutdated(arg));
  };
}
