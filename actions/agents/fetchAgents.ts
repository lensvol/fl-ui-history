import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  ASSIGN_AGENTS_REQUESTED,
  CLEAR_AGENTS_NOTIFCATION,
  FETCH_AGENTS_REQUESTED,
  FETCH_AGENTS_SUCCESS,
} from "actiontypes/agents";

import AgentsService, {
  FetchAgentsResponse,
  IAgentsService,
} from "services/AgentsService";

import { Success } from "services/BaseMonadicService";

import { VersionMismatch } from "services/BaseService";

import { Agent } from "types/agents";

export type FetchAgentsRequested = {
  type: typeof FETCH_AGENTS_REQUESTED;
};

export type FetchAgentsSuccess = {
  type: typeof FETCH_AGENTS_SUCCESS;
  payload: FetchAgentsResponse;
};

export type ClearAgentsNotification = {
  type: typeof CLEAR_AGENTS_NOTIFCATION;
};

export type FetchAgentsAction =
  | FetchAgentsRequested
  | FetchAgentsSuccess
  | ClearAgentsNotification;

export const clearAgentsNotification: ActionCreator<
  ClearAgentsNotification
> = () => ({
  type: CLEAR_AGENTS_NOTIFCATION,
});

export type AssignAgentRequested = {
  type: typeof ASSIGN_AGENTS_REQUESTED;
  payload: {
    agentToAssign?: Agent;
  };
};

export type AssignAgentAction = AssignAgentRequested;

export const showAssignAgents: ActionCreator<AssignAgentRequested> = (
  agent?: Agent
) => ({
  type: ASSIGN_AGENTS_REQUESTED,
  payload: {
    agentToAssign: agent,
  },
});

export default fetchAgents(new AgentsService());

export function fetchAgents(service: IAgentsService) {
  return (setIsFetching?: boolean) => async (dispatch: Function) => {
    try {
      if (setIsFetching) {
        dispatch(fetchAgentsRequested());
      }

      const result = await service.fetchAgents();

      if (result instanceof Success) {
        dispatch(fetchAgentsSuccess(result.data));
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

export const fetchAgentsRequested: ActionCreator<
  FetchAgentsRequested
> = () => ({
  type: FETCH_AGENTS_REQUESTED,
});

export const fetchAgentsSuccess: ActionCreator<FetchAgentsSuccess> = (
  data: FetchAgentsResponse
) => ({
  type: FETCH_AGENTS_SUCCESS,
  payload: data,
});
