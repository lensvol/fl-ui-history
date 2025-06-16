import React from "react";

import AgentAlert from "components/Agents/AgentAlert";
import Chronograph from "components/Alert/Chronograph";
import News from "components/News";

import { useAppSelector } from "features/app/store";

export default function Alert() {
  const hasAgentAlert = useAppSelector((state) => state.agents.hasNotification);
  const isChronographVisible = useAppSelector(
    (state) => state.actions.chronograph.isVisible
  );

  if (hasAgentAlert) {
    return <AgentAlert />;
  }

  if (isChronographVisible) {
    return <Chronograph />;
  }

  return <News />;
}

Alert.displayName = "Alert";
