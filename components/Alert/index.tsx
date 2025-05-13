import React from "react";

import AgentAlert from "components/Agents/AgentAlert";
import News from "components/News";

import { useAppSelector } from "features/app/store";

export default function Alert() {
  const hasAgentAlert = useAppSelector((state) => state.agents.hasNotification);

  if (hasAgentAlert) {
    return <AgentAlert />;
  }

  return <News />;
}

Alert.displayName = "Alert";
