import { ActionCreator } from "redux";

import { processMessages } from "actions/app";
import { handleVersionMismatch } from "actions/versionSync";

import { BEGIN_PLOT_REQUESTED, BEGIN_PLOT_SUCCESS } from "actiontypes/agents";

import AgentsService, {
  BeginPlotResponse,
  IAgentsService,
} from "services/AgentsService";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";

export type BeginPlotRequested = {
  type: typeof BEGIN_PLOT_REQUESTED;
};

export type BeginPlotSuccess = {
  type: typeof BEGIN_PLOT_SUCCESS;
  payload: BeginPlotResponse;
};

export type BeginPlotAction = BeginPlotRequested | BeginPlotSuccess;

export default beginPlot(new AgentsService());

export function beginPlot(service: IAgentsService) {
  return (agentId: number, plotId: number) => async (dispatch: Function) => {
    try {
      dispatch(beginPlotRequested());

      const result = await service.beginPlot(agentId, plotId);

      if (result instanceof Success) {
        dispatch(beginPlotSuccess(result.data));

        if (result.data.messages) {
          dispatch(processMessages(result.data.messages));
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

export const beginPlotRequested: ActionCreator<BeginPlotRequested> = () => ({
  type: BEGIN_PLOT_REQUESTED,
});

export const beginPlotSuccess: ActionCreator<BeginPlotSuccess> = (
  data: BeginPlotResponse
) => ({
  type: BEGIN_PLOT_SUCCESS,
  payload: data,
});
