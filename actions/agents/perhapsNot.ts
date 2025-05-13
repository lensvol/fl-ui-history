import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import { PERHAPS_NOT_REQUESTED, PERHAPS_NOT_SUCCESS } from "actiontypes/agents";

import AgentsService, {
  IAgentsService,
  PerhapsNotResponse,
} from "services/AgentsService";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";

export type PerhapsNotRequested = {
  type: typeof PERHAPS_NOT_REQUESTED;
};

export type PerhapsNotSuccess = {
  type: typeof PERHAPS_NOT_SUCCESS;
  payload: PerhapsNotResponse;
};

export type PerhapsNotAction = PerhapsNotRequested | PerhapsNotSuccess;

export default PerhapsNot(new AgentsService());

export function PerhapsNot(service: IAgentsService) {
  return (agentId: number) => async (dispatch: Function) => {
    try {
      dispatch(perhapsNotRequested());

      const result = await service.perhapsNot(agentId);

      if (result instanceof Success) {
        dispatch(perhapsNotSuccess(result.data));
      }

      return result;
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));

        return;
      }

      throw e;
    }
  };
}

export const perhapsNotRequested: ActionCreator<PerhapsNotRequested> = () => ({
  type: PERHAPS_NOT_REQUESTED,
});

export const perhapsNotSuccess: ActionCreator<PerhapsNotSuccess> = (
  data: PerhapsNotResponse
) => ({
  type: PERHAPS_NOT_SUCCESS,
  payload: data,
});
