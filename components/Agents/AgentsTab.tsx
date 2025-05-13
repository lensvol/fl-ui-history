import React, { useEffect, useState } from "react";

import ReactCSSTransitionReplace from "react-css-transition-replace";

import { useDispatch } from "react-redux";

import { hideAllAgentAlerts } from "actions/agents/agentAlert";
import fetchAgents from "actions/agents/fetchAgents";
import { setTab } from "actions/subtabs";

import Agents from "components/Agents";
import AgentReportView from "components/Agents/AgentReportView";
import AssignAgentView from "components/Agents/AssignAgentView";
import GeneralContainer from "components/GeneralContainer";
import InnerTabs from "components/InnerTabs";
import Loading from "components/Loading";
import MediaSmDown from "components/Responsive/MediaSmDown";

import { useAppSelector } from "features/app/store";

export default function AgentsTab() {
  const dispatch = useDispatch();
  const isFetchingAgents = useAppSelector(
    (state) => state.agents.isFetchingAgents
  );
  const agentToAssign = useAppSelector((state) => state.agents.agentToAssign);
  const report = useAppSelector((state) => state.agents.report);

  const [didFetchAgents, setDidFetchAgents] = useState(false);

  // Fetch agents on load
  useEffect(() => {
    if (didFetchAgents) {
      return;
    }

    dispatch(
      setTab({
        tab: "myself",
        subtab: "agents",
      })
    );

    asyncUseEffect();

    async function asyncUseEffect() {
      await dispatch(fetchAgents(true));
      await dispatch(hideAllAgentAlerts());
      setDidFetchAgents(true);
    }
  }, [didFetchAgents, dispatch]);

  return (
    <GeneralContainer>
      <ReactCSSTransitionReplace
        transitionName="fade-wait"
        transitionEnterTimeout={100}
        transitionLeaveTimeout={100}
      >
        <>
          <MediaSmDown>
            <InnerTabs />
          </MediaSmDown>

          {isFetchingAgents || !didFetchAgents ? (
            <Loading key="loading" />
          ) : report ? (
            <AgentReportView />
          ) : agentToAssign ? (
            <AssignAgentView key="assign" />
          ) : (
            <Agents key="agents" />
          )}
        </>
      </ReactCSSTransitionReplace>
    </GeneralContainer>
  );
}

AgentsTab.displayName = "AgentsTab";
