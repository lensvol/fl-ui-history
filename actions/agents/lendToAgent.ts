import { ActionCreator } from "redux";

import { fetchOutfit } from "actions/outfit";
import { handleVersionMismatch } from "actions/versionSync";

import {
  LEND_TO_AGENT_REQUESTED,
  LEND_TO_AGENT_SUCCESS,
} from "actiontypes/agents";

import AgentsService, {
  IAgentsService,
  LendToAgentResponse,
} from "services/AgentsService";

import { Success } from "services/BaseMonadicService";

import { VersionMismatch } from "services/BaseService";

export type LendToAgentRequested = {
  type: typeof LEND_TO_AGENT_REQUESTED;
};

export type LendToAgentSuccess = {
  type: typeof LEND_TO_AGENT_SUCCESS;
  payload: LendToAgentResponse;
};

export type LendToAgentAction = LendToAgentRequested | LendToAgentSuccess;

export default lendToAgent(new AgentsService());

export function lendToAgent(service: IAgentsService) {
  return (
      agentId: number,
      itemId: number,
      shouldFetchOutfit: boolean,
      plotId?: number
    ) =>
    async (dispatch: Function) => {
      try {
        dispatch(lendToAgentRequested());

        const result = await service.lendToAgent(agentId, itemId, plotId);

        if (result instanceof Success) {
          dispatch(lendToAgentSuccess(result.data));

          if (shouldFetchOutfit) {
            dispatch(fetchOutfit());
          }
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

export const lendToAgentRequested: ActionCreator<
  LendToAgentRequested
> = () => ({
  type: LEND_TO_AGENT_REQUESTED,
});

export const lendToAgentSuccess: ActionCreator<LendToAgentSuccess> = (
  data: LendToAgentResponse
) => ({
  type: LEND_TO_AGENT_SUCCESS,
  payload: data,
});
