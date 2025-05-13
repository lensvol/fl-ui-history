import BaseService, { Either } from "services/BaseMonadicService";
import { IApiStoryletResponseData } from "services/StoryletService";

import { Agent, Concern, Plot, PlotHint } from "types/agents";
import { IMessages } from "types/app/messages";

export type FetchAgentsResponse = {
  agents: Agent[];
  maxPlots: number;
  report?: HearReportResponse;
};

export type AbandonPlotResponse = IApiStoryletResponseData;
export type HearReportResponse = IApiStoryletResponseData;
export type PerhapsNotResponse = IApiStoryletResponseData;

export type LendToAgentResponse = {
  agents: Agent[];
  plotId?: number;
  hints: PlotHint[];
};

export type FetchPlotsAndConcernsResponse = {
  agent: Agent;
  concerns: Concern[];
  plots: Plot[];
};

export type BeginPlotResponse = {
  agents: Agent[];
  description: string;
  image: string;
  messages?: IMessages;
  name: string;
};

export type IChooseReportBranchRequestData = {
  branchId: number;
  secondChanceIds?: number[];
};

export interface IAgentsService {
  fetchAgents: () => Promise<Either<FetchAgentsResponse>>;
  lendToAgent: (
    agentId: number,
    itemId: number,
    plotId?: number
  ) => Promise<Either<LendToAgentResponse>>;
  takeFromAgent: (
    agentId: number,
    category: string,
    plotId?: number
  ) => Promise<Either<LendToAgentResponse>>;
  takeAllFromAgent: (agentId: number) => Promise<Either<LendToAgentResponse>>;
  fetchPlotsAndConcerns: (
    agentId: number
  ) => Promise<Either<FetchPlotsAndConcernsResponse>>;
  beginPlot: (
    agentId: number,
    plotId: number
  ) => Promise<Either<BeginPlotResponse>>;
  hearReport: (agentId: number) => Promise<Either<HearReportResponse>>;
  abandonPlot: (agentId: number) => Promise<Either<AbandonPlotResponse>>;
  perhapsNot: (agentId: number) => Promise<Either<AbandonPlotResponse>>;
  chooseReportBranch: (
    data: IChooseReportBranchRequestData
  ) => Promise<Either<HearReportResponse>>;
}

export default class AgentsService
  extends BaseService
  implements IAgentsService
{
  fetchAgents = () => {
    const config = {
      method: "get",
      url: "/agents",
    };

    return this.doRequest<FetchAgentsResponse>(config);
  };

  lendToAgent = (agentId: number, itemId: number, plotId?: number) => {
    const config = {
      method: "post",
      url: "/agents/lend",
      data: {
        agentId,
        itemId,
        plotId,
      },
    };

    return this.doRequest<LendToAgentResponse>(config);
  };

  takeFromAgent = (agentId: number, category: string, plotId?: number) => {
    const config = {
      method: "post",
      url: "/agents/lend",
      data: {
        agentId,
        category,
        plotId,
      },
    };

    return this.doRequest<LendToAgentResponse>(config);
  };

  takeAllFromAgent = (agentId: number) => {
    const config = {
      method: "post",
      url: "/agents/lend",
      data: {
        agentId,
      },
    };

    return this.doRequest<LendToAgentResponse>(config);
  };

  fetchPlotsAndConcerns = (agentId: number) => {
    const config = {
      method: "get",
      url: `/agents/plots?agentId=${agentId}`,
    };

    return this.doRequest<FetchPlotsAndConcernsResponse>(config);
  };

  beginPlot = (agentId: number, plotId: number) => {
    const config = {
      method: "post",
      url: "/agents/begin",
      data: {
        agentId,
        plotId,
      },
    };

    return this.doRequest<BeginPlotResponse>(config);
  };

  hearReport = (agentId: number) => {
    const config = {
      method: "post",
      url: "/agents/report",
      data: {
        agentId,
      },
    };

    return this.doRequest<HearReportResponse>(config);
  };

  abandonPlot = (agentId: number) => {
    const config = {
      method: "post",
      url: "/agents/abandon",
      data: {
        agentId,
      },
    };

    return this.doRequest<AbandonPlotResponse>(config);
  };

  perhapsNot = (agentId: number) => {
    const config = {
      method: "post",
      url: "/agents/perhapsnot",
      data: {
        agentId,
      },
    };

    return this.doRequest<AbandonPlotResponse>(config);
  };

  chooseReportBranch = (data: IChooseReportBranchRequestData) => {
    const config = {
      method: "post",
      url: "/agents/branch",
      data,
    };

    return this.doRequest<HearReportResponse>(config);
  };
}
