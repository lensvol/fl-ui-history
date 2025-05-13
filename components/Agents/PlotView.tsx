import React, { useCallback, useState } from "react";

import classnames from "classnames";

import ActionButton from "components/ActionButton";
import QualityRequirements from "components/Branch/QualityRequirements";
import {
  StoryletCard,
  StoryletDescription,
  StoryletTitle,
} from "components/common";
import Loading from "components/Loading";

import { Plot } from "types/agents";

type Props = {
  concernView?: boolean;
  onSelectPlot: (plot: Plot) => void;
  plot: Plot;
};

export default function PlotView({ concernView, onSelectPlot, plot }: Props) {
  const [isWorking, setIsWorking] = useState(false);

  const isConcernView = concernView ?? false;

  const onChoosePlot = useCallback(() => {
    setIsWorking(true);
    onSelectPlot(plot);
  }, [onSelectPlot, plot]);

  return (
    <div
      className={classnames(
        "plot-container",
        plot.qualityLocked && "media--locked",
        plot.currencyCost > 0 && "media--fate-locked",
        isConcernView && "plot-for-concern",
        !plot.qualityLocked && plot.currencyCost === 0 && "media--message"
      )}
    >
      <div className="plot__image">
        <StoryletCard
          border
          borderColour={plot.currencyCost ? "gold" : "silver"}
          defaultCursor
          image={plot.image}
          imageHeight={100}
          imageWidth={78}
          name={plot.name}
        />
      </div>
      <div className="plot__body">
        <div>
          <StoryletTitle name={plot.name} className="branch__title" />
          <StoryletDescription text={plot.description} />
        </div>
      </div>
      <div className="plot__buttons">
        <div className="buttons storylet__buttons">
          <ActionButton
            go
            disabled={plot.qualityLocked}
            isWorking={isWorking}
            data={{
              requirementLocked: plot.qualityLocked,
              buttonText: "Prepare",
            }}
            onClick={onChoosePlot}
          >
            {isWorking && <Loading spinner small />}
          </ActionButton>
          <QualityRequirements requirements={plot.qualityRequirements} />
        </div>
      </div>
    </div>
  );
}

PlotView.displayName = "PlotView";
