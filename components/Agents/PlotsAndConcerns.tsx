import React from "react";

import classnames from "classnames";

import ConcernView from "components/Agents/ConcernView";
import PlotView from "components/Agents/PlotView";
import Image from "components/Image";

import { useAppSelector } from "features/app/store";

import { Concern, Plot } from "types/agents";

type Props = {
  concern?: Concern;
  concerns?: Concern[];
  onPerhapsNot: () => void;
  onSelectConcern: (concern: Concern) => void;
  onSelectPlot: (plot: Plot) => void;
  plots?: Plot[];
};

export default function PlotsAndConcerns({
  concern,
  concerns,
  onPerhapsNot,
  onSelectConcern,
  onSelectPlot,
  plots,
}: Props) {
  const agent = useAppSelector((state) => state.agents.agentToAssign)!;
  const thePlots = plots ?? concern?.plots ?? [];
  const sliceIndex = thePlots.findIndex((plot) => plot.qualityLocked);
  const unlockedPlots =
    sliceIndex === -1 ? thePlots : thePlots.slice(0, sliceIndex);
  const lockedPlots = sliceIndex === -1 ? [] : thePlots.slice(sliceIndex);

  return (
    <>
      <div className="agent-to-assign">
        <Image alt={agent.name} icon={agent.image} type="small-icon" />
        <span className="heading heading--3 heading--close">
          Assigning: {agent.name}
        </span>
      </div>

      {concern && (
        <ConcernView
          key={concern.id}
          concern={concern}
          header
          onSelectConcern={onSelectConcern}
        />
      )}

      {unlockedPlots.map((plot) => (
        <PlotView
          key={plot.id}
          concernView={!!concern}
          plot={plot}
          onSelectPlot={onSelectPlot}
        />
      ))}

      {concerns?.map((concern) => (
        <ConcernView
          key={concern.id}
          concern={concern}
          onSelectConcern={onSelectConcern}
        />
      ))}

      {lockedPlots.map((plot) => (
        <PlotView
          key={plot.id}
          concernView={!!concern}
          plot={plot}
          onSelectPlot={onSelectPlot}
        />
      ))}

      <div>
        <button
          className={classnames("agent-assign-button")}
          onClick={onPerhapsNot}
          type="button"
        >
          <i className="fa fa-arrow-left" /> Perhaps not
        </button>
      </div>
    </>
  );
}

PlotsAndConcerns.displayName = "PlotsAndConcerns";
