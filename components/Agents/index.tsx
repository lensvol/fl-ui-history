import React from "react";

import AgentsMainView from "components/Agents/AgentsMainView";

import { useAppSelector } from "features/app/store";

export default function Agents() {
  const maxPlots = useAppSelector((state) => state.agents.maxPlots);
  const currentPlots = useAppSelector(
    (state) =>
      state.agents.agents.filter((agent) => agent.plot !== undefined).length
  );

  if (maxPlots === 0) {
    return null;
  }

  return (
    <div id="agents">
      <div className="agents-header">
        <h1 className="heading heading--1 heading--close">Agents</h1>
        <span className="heading heading--3 heading--close">
          {currentPlots}/{maxPlots} Active Plots
        </span>
      </div>
      <hr />
      <AgentsMainView />
    </div>
  );
}

Agents.displayName = "Agents";
