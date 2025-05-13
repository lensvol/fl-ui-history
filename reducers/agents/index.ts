import { AbandonPlotSuccess } from "actions/agents/abandonPlot";
import {
  HideAgentAlertNotification,
  HideAllAgentAlertsNotification,
  UnhideAgentAlertNotification,
} from "actions/agents/agentAlert";
import { BeginPlotAction } from "actions/agents/beginPlot";
import { ChooseReportBranchSuccessAction } from "actions/agents/chooseReportBranch";
import {
  AssignAgentAction,
  FetchAgentsAction,
  FetchAgentsSuccess,
} from "actions/agents/fetchAgents";
import { FetchPlotsAndConcernsAction } from "actions/agents/fetchPlots";
import { HearReportAction } from "actions/agents/hearReport";
import { LendToAgentAction } from "actions/agents/lendToAgent";
import { PerhapsNotSuccess } from "actions/agents/perhapsNot";
import { AcceptSuccess } from "actions/messages/accept";
import { BeginSuccessAction } from "actions/storylet/begin";
import { ChooseBranchSuccessAction } from "actions/storylet/chooseBranch/chooseBranchSuccess";
import { FetchAvailableSuccessAction } from "actions/storylet/fetchAvailable";
import { RenameQualitySuccessAction } from "actions/storylet/renameQuality";
import { SendSocialInviteSuccessAction } from "actions/storylet/sendSocialinvite";

import {
  ABANDON_PLOT_SUCCESS,
  ASSIGN_AGENTS_REQUESTED,
  BEGIN_PLOT_SUCCESS,
  CHOOSE_REPORT_BRANCH_SUCCESS,
  CLEAR_AGENTS_NOTIFCATION,
  FETCH_AGENTS_REQUESTED,
  FETCH_AGENTS_SUCCESS,
  FETCH_PLOTS_AND_CONCERNS_REQUESTED,
  FETCH_PLOTS_AND_CONCERNS_SUCCESS,
  HEAR_REPORT_SUCCESS,
  HIDE_AGENT_ALERT_NOTIFCATION,
  HIDE_ALL_AGENT_ALERTS_NOTIFCATION,
  LEND_TO_AGENT_REQUESTED,
  LEND_TO_AGENT_SUCCESS,
  PERHAPS_NOT_SUCCESS,
  UNHIDE_AGENT_ALERT_NOTIFCATION,
} from "actiontypes/agents";
import { ACCEPT_SUCCESS } from "actiontypes/messages";
import {
  CHOOSE_BRANCH_SUCCESS,
  CHOOSE_STORYLET_SUCCESS,
  FETCH_AVAILABLE_SUCCESS,
  RENAME_QUALITY_SUCCESS,
  SEND_SOCIAL_INVITATION_SUCCESS,
} from "actiontypes/storylet";

import { Agent, AgentReport, Concern, Plot, PlotResult } from "types/agents";

export interface IAgentsState {
  // ui flags
  hasFetchedAgents: boolean;
  hasNotification: boolean;
  isFetchingAgent: boolean;
  isFetchingAgents: boolean;
  isFetchingPlots: boolean;
  showAlertIds: number[];
  hideAlertIds: number[];

  // game state flags
  agents: Agent[];
  agentToAssign?: Agent;
  concerns: Concern[];
  maxPlots: number;
  plotResult?: PlotResult;
  report?: AgentReport;
}

const INITIAL_STATE: IAgentsState = {
  agents: [],
  agentToAssign: undefined,
  concerns: [],
  hasFetchedAgents: false,
  hasNotification: false,
  isFetchingAgent: false,
  isFetchingAgents: false,
  isFetchingPlots: false,
  showAlertIds: [],
  hideAlertIds: [],
  maxPlots: 0,
  plotResult: undefined,
  report: undefined,
};

type AgentsAction =
  | AbandonPlotSuccess
  | AcceptSuccess
  | AssignAgentAction
  | BeginPlotAction
  | BeginSuccessAction
  | ChooseBranchSuccessAction
  | ChooseReportBranchSuccessAction
  | FetchAgentsAction
  | FetchAvailableSuccessAction
  | FetchPlotsAndConcernsAction
  | HearReportAction
  | HideAgentAlertNotification
  | HideAllAgentAlertsNotification
  | LendToAgentAction
  | PerhapsNotSuccess
  | RenameQualitySuccessAction
  | SendSocialInviteSuccessAction
  | UnhideAgentAlertNotification;

type IncrementActionsAction =
  | AcceptSuccess
  | BeginSuccessAction
  | ChooseBranchSuccessAction
  | FetchAvailableSuccessAction
  | RenameQualitySuccessAction
  | SendSocialInviteSuccessAction;

export default function reducer(
  state = INITIAL_STATE,
  action: AgentsAction
): IAgentsState {
  switch (action.type) {
    case FETCH_AGENTS_REQUESTED:
      return {
        ...state,
        isFetchingAgents: true,
      };

    case FETCH_AGENTS_SUCCESS:
      const fetchAgentsSuccessShowAlertIds = fetchShowAlertIds(action);
      const fetchAgentsSuccessHasNotification = agentsHaveNotification(
        state,
        action.payload.agents
      );

      return {
        ...state,
        isFetchingAgents: false,
        hasFetchedAgents: true,
        hasNotification: fetchAgentsSuccessHasNotification,
        showAlertIds: fetchAgentsSuccessShowAlertIds,
        maxPlots: action.payload.maxPlots,
        agents: action.payload.agents,
        agentToAssign:
          state.agentToAssign === undefined
            ? undefined
            : action.payload.agents.find(
                (agent) => agent.id === state.agentToAssign?.id
              ),
        report: action.payload.report,
      };

    case LEND_TO_AGENT_REQUESTED:
      return {
        ...state,
        isFetchingAgent: true,
      };

    case LEND_TO_AGENT_SUCCESS:
      return {
        ...state,
        isFetchingAgent: false,
        agents: action.payload.agents,
        agentToAssign:
          state.agentToAssign === undefined
            ? undefined
            : action.payload.agents.find(
                (agent) => agent.id === state.agentToAssign?.id
              ),
        concerns: state.concerns.map(
          (concern) =>
            ({
              ...concern,
              plots: concern.plots.map(
                (plot) =>
                  ({
                    ...plot,
                    hints:
                      state.agentToAssign === undefined ||
                      plot.id !== action.payload.plotId
                        ? plot.hints
                        : action.payload.hints,
                  }) as Plot
              ),
            }) as Concern
        ),
      };

    case CLEAR_AGENTS_NOTIFCATION:
      return {
        ...state,
        hasNotification: false,
      };

    case ASSIGN_AGENTS_REQUESTED:
      return {
        ...state,
        agentToAssign: action.payload.agentToAssign,
      };

    case FETCH_PLOTS_AND_CONCERNS_REQUESTED:
      return {
        ...state,
        isFetchingPlots: true,
      };

    case FETCH_PLOTS_AND_CONCERNS_SUCCESS:
      return {
        ...state,
        isFetchingPlots: false,
        agentToAssign: action.payload.agent,
        concerns: [
          {
            id: 0,
            plots: action.payload.plots,
          } as Concern,
          ...action.payload.concerns,
        ],
      };

    case BEGIN_PLOT_SUCCESS:
      return {
        ...state,
        isFetchingAgent: false,
        agents: action.payload.agents,
        plotResult: {
          name: action.payload.name,
          description: action.payload.description,
          image: action.payload.image,
          messages: action.payload.messages,
        },
      };

    case ACCEPT_SUCCESS:
    case CHOOSE_BRANCH_SUCCESS:
    case CHOOSE_STORYLET_SUCCESS:
    case FETCH_AVAILABLE_SUCCESS:
    case RENAME_QUALITY_SUCCESS:
    case SEND_SOCIAL_INVITATION_SUCCESS:
      const incrementActionAgents = incrementActionsAgents(state, action);
      const incrementActionHasNotfication = agentsHaveNotification(
        state,
        incrementActionAgents
      );

      return {
        ...state,
        hasNotification: incrementActionHasNotfication,
        agents: incrementActionAgents,
      };

    case ABANDON_PLOT_SUCCESS:
    case HEAR_REPORT_SUCCESS:
    case CHOOSE_REPORT_BRANCH_SUCCESS:
      return {
        ...state,
        report: action.payload,
      };

    case PERHAPS_NOT_SUCCESS:
      return {
        ...state,
        report: undefined,
      };

    case HIDE_AGENT_ALERT_NOTIFCATION:
      const hideAgentHasNotification =
        state.agents.filter(
          (agent) =>
            agent.plot &&
            agent.plot.duration <= (agent.plot.elapsed ?? 0) &&
            agent.id !== action.payload.alertId &&
            !state.hideAlertIds.includes(agent.id)
        ).length !== 0;

      return {
        ...state,
        hasNotification: hideAgentHasNotification,
        hideAlertIds: [
          ...state.hideAlertIds.filter((id) => id !== action.payload.alertId), // prevent duplicates
          action.payload.alertId,
        ],
      };

    case HIDE_ALL_AGENT_ALERTS_NOTIFCATION:
      return {
        ...state,
        hasNotification: false,
        showAlertIds: [],
        hideAlertIds: state.showAlertIds,
      };

    case UNHIDE_AGENT_ALERT_NOTIFCATION:
      return {
        ...state,
        hasNotification: false,
        hideAlertIds: state.hideAlertIds.filter(
          (id) => id !== action.payload.alertId
        ),
      };

    default:
      // no-op
      return {
        ...state,
      };
  }
}

function fetchShowAlertIds(action: FetchAgentsSuccess) {
  return action.payload.agents
    .filter(
      (agent) => agent.plot && agent.plot.duration <= (agent.plot.elapsed ?? 0)
    )
    .map((agent) => agent.id)
    .sort();
}

// an IncrementActionsAction can only tell us if a plot has completed
function agentsHaveNotification(state: IAgentsState, agents: Agent[]) {
  return (
    agents.filter(
      (agent) =>
        agent.plot &&
        agent.plot.duration <= (agent.plot.elapsed ?? 0) &&
        !state.hideAlertIds.includes(agent.id)
    ).length !== 0
  );
}

function incrementActionsAgents(
  state: IAgentsState,
  action: IncrementActionsAction
) {
  return state.agents.map(
    (agent) =>
      ({
        ...agent,
        plot:
          agent.plot === undefined
            ? undefined
            : ({
                ...agent.plot,
                elapsed:
                  (agent.plot.elapsed ?? 0) + (action.payload.elapsed ?? 0),
              } as Plot),
      }) as Agent
  );
}
