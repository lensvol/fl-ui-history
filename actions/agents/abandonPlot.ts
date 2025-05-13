import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  ABANDON_PLOT_REQUESTED,
  ABANDON_PLOT_SUCCESS,
} from "actiontypes/agents";

import AgentsService, {
  AbandonPlotResponse,
  IAgentsService,
} from "services/AgentsService";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";

export type AbandonPlotRequested = {
  type: typeof ABANDON_PLOT_REQUESTED;
};

export type AbandonPlotSuccess = {
  type: typeof ABANDON_PLOT_SUCCESS;
  payload: AbandonPlotResponse;
};

export type AbandonPlotAction = AbandonPlotRequested | AbandonPlotSuccess;

export default AbandonPlot(new AgentsService());

export function AbandonPlot(service: IAgentsService) {
  return (agentId: number) => async (dispatch: Function) => {
    try {
      dispatch(abandonPlotRequested());

      const result = await service.abandonPlot(agentId);

      if (result instanceof Success) {
        dispatch(abandonPlotSuccess(result.data));
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

export const abandonPlotRequested: ActionCreator<
  AbandonPlotRequested
> = () => ({
  type: ABANDON_PLOT_REQUESTED,
});

export const abandonPlotSuccess: ActionCreator<AbandonPlotSuccess> = (
  data: AbandonPlotResponse
) => ({
  type: ABANDON_PLOT_SUCCESS,
  payload: data,
});
