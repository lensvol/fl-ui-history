import {
  lendToAgentRequested,
  lendToAgentSuccess,
} from "actions/agents/lendToAgent";
import { handleVersionMismatch } from "actions/versionSync";

import AgentsService, { IAgentsService } from "services/AgentsService";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";

export default takeFromAgent(new AgentsService());

export function takeFromAgent(service: IAgentsService) {
  return (agentId: number, category: string, plotId?: number) =>
    async (dispatch: Function) => {
      try {
        dispatch(lendToAgentRequested());

        const result = await service.takeFromAgent(agentId, category, plotId);

        if (result instanceof Success) {
          dispatch(lendToAgentSuccess(result.data));
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
