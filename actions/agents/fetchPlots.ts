import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  FETCH_PLOTS_AND_CONCERNS_REQUESTED,
  FETCH_PLOTS_AND_CONCERNS_SUCCESS,
} from "actiontypes/agents";

import AgentsService, {
  IAgentsService,
  FetchPlotsAndConcernsResponse,
} from "services/AgentsService";

import { Success } from "services/BaseMonadicService";

import { VersionMismatch } from "services/BaseService";

export type FetchPlotsAndConcernsRequested = {
  type: typeof FETCH_PLOTS_AND_CONCERNS_REQUESTED;
};

export type FetchPlotsAndConcernsSuccess = {
  type: typeof FETCH_PLOTS_AND_CONCERNS_SUCCESS;
  payload: FetchPlotsAndConcernsResponse;
};

export type FetchPlotsAndConcernsAction =
  | FetchPlotsAndConcernsRequested
  | FetchPlotsAndConcernsSuccess;

export default fetchPlots(new AgentsService());

export function fetchPlots(service: IAgentsService) {
  return (agentId: number) => async (dispatch: Function) => {
    try {
      dispatch(fetchPlotsAndConcernsRequested());

      const result = await service.fetchPlotsAndConcerns(agentId);

      if (result instanceof Success) {
        dispatch(fetchPlotsAndConcernsSuccess(result.data));
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

export const fetchPlotsAndConcernsRequested: ActionCreator<
  FetchPlotsAndConcernsRequested
> = () => ({
  type: FETCH_PLOTS_AND_CONCERNS_REQUESTED,
});

export const fetchPlotsAndConcernsSuccess: ActionCreator<
  FetchPlotsAndConcernsSuccess
> = (data: FetchPlotsAndConcernsResponse) => ({
  type: FETCH_PLOTS_AND_CONCERNS_SUCCESS,
  payload: data,
});
