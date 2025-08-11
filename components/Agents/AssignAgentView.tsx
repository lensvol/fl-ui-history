import React, { useCallback, useState } from "react";

import { useDispatch } from "react-redux";

import beginPlot from "actions/agents/beginPlot";
import { showAssignAgents } from "actions/agents/fetchAgents";

import AssignPlotView from "components/Agents/AssignPlotView";
import PlotResultView from "components/Agents/PlotResultView";
import PlotsAndConcerns from "components/Agents/PlotsAndConcerns";
import plotSorter from "components/Agents/plotSorter";

import { useAppSelector } from "features/app/store";

import { Concern, Plot } from "types/agents";

enum AgentAssignViewType {
  Concern,
  Plot,
  PlotResult,
  PlotsAndConcerns,
}

export default function AssignAgentView() {
  const dispatch = useDispatch();
  const agent = useAppSelector((state) => state.agents.agentToAssign);
  const allConcerns = useAppSelector((state) => state.agents.concerns);
  const plots = (
    allConcerns.find((concern) => concern.id === 0)?.plots ?? []
  ).sort(plotSorter);
  const concerns = allConcerns
    .filter((concern) => concern.id !== 0)
    .sort((concern) => concern.id);
  const skipToConcernView = plots.length === 0 && concerns.length === 1;
  const [viewType, setViewType] = useState(
    skipToConcernView
      ? AgentAssignViewType.Concern
      : AgentAssignViewType.PlotsAndConcerns
  );
  const [selectedConcern, setSelectedConcern] = useState<Concern | undefined>(
    skipToConcernView ? concerns[0] : undefined
  );
  const [selectedPlot, setSelectedPlot] = useState<Plot | undefined>(undefined);

  const onDismissAssign = useCallback(() => {
    dispatch(showAssignAgents(undefined));
  }, [dispatch]);

  const onSelectConcern = useCallback((concern: Concern) => {
    setViewType(AgentAssignViewType.Concern);
    setSelectedConcern(concern);
  }, []);

  const onDismissConcern = useCallback(() => {
    if (skipToConcernView) {
      onDismissAssign();
    } else {
      setViewType(AgentAssignViewType.PlotsAndConcerns);
      setSelectedConcern(undefined);
    }
  }, [onDismissAssign, skipToConcernView]);

  const onSelectPlot = useCallback((plot: Plot) => {
    setViewType(AgentAssignViewType.Plot);
    setSelectedPlot(plot);
  }, []);

  const onDismissPlot = useCallback(() => {
    setViewType(
      selectedConcern
        ? AgentAssignViewType.Concern
        : AgentAssignViewType.PlotsAndConcerns
    );
    setSelectedPlot(undefined);
  }, [selectedConcern]);

  const onSendOff = useCallback(async () => {
    await dispatch(beginPlot(agent!.id, selectedPlot!.id));

    setViewType(AgentAssignViewType.PlotResult);
  }, [agent, dispatch, selectedPlot]);

  const onDismissPlotResult = useCallback(async () => {
    await dispatch(showAssignAgents(undefined));
  }, [dispatch]);

  if (agent === undefined) {
    // should be unreachable
    return null;
  }

  return (
    <div className="agent-assign-view">
      <h1 className="heading heading--1 heading--close">Agents</h1>
      <hr />
      <div className="agent-assign-container">
        {viewType === AgentAssignViewType.PlotsAndConcerns && (
          <PlotsAndConcerns
            concerns={concerns}
            onPerhapsNot={onDismissAssign}
            onSelectConcern={onSelectConcern}
            onSelectPlot={onSelectPlot}
            plots={plots}
          />
        )}

        {viewType === AgentAssignViewType.Concern && (
          <PlotsAndConcerns
            concern={selectedConcern}
            onPerhapsNot={onDismissConcern}
            onSelectConcern={onSelectConcern}
            onSelectPlot={onSelectPlot}
          />
        )}

        {viewType === AgentAssignViewType.Plot && (
          <AssignPlotView
            onDismissPlot={onDismissPlot}
            onSendOff={onSendOff}
            plotId={selectedPlot!.id}
          />
        )}

        {viewType === AgentAssignViewType.PlotResult && (
          <PlotResultView
            onDismissPlotResult={onDismissPlotResult}
            plot={selectedPlot!}
          />
        )}
      </div>
    </div>
  );
}

AssignAgentView.displayName = "AssignAgentView";
