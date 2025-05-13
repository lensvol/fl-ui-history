import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import { HEAR_REPORT_REQUESTED, HEAR_REPORT_SUCCESS } from "actiontypes/agents";

import AgentsService, {
  HearReportResponse,
  IAgentsService,
} from "services/AgentsService";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";

export type HearReportRequested = {
  type: typeof HEAR_REPORT_REQUESTED;
};

export type HearReportSuccess = {
  type: typeof HEAR_REPORT_SUCCESS;
  payload: HearReportResponse;
};

export type HearReportAction = HearReportRequested | HearReportSuccess;

export default hearReport(new AgentsService());

export function hearReport(service: IAgentsService) {
  return (agentId: number) => async (dispatch: Function) => {
    try {
      dispatch(hearReportRequested());

      const result = await service.hearReport(agentId);

      if (result instanceof Success) {
        dispatch(hearReportSuccess(result.data));
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

export const hearReportRequested: ActionCreator<HearReportRequested> = () => ({
  type: HEAR_REPORT_REQUESTED,
});

export const hearReportSuccess: ActionCreator<HearReportSuccess> = (
  data: HearReportResponse
) => ({
  type: HEAR_REPORT_SUCCESS,
  payload: data,
});
