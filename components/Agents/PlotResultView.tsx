import React, { useCallback, useState } from "react";

import classnames from "classnames";

import ActionButton from "components/ActionButton";
import {
  StoryletCard,
  StoryletDescription,
  StoryletTitle,
} from "components/common";
import Image from "components/Image";
import Loading from "components/Loading";
import QualityUpdates from "components/QualityUpdates";
import MediaMdUp from "components/Responsive/MediaMdUp";
import MediaSmDown from "components/Responsive/MediaSmDown";

import { useAppSelector } from "features/app/store";

import { Plot } from "types/agents";

type Props = {
  onDismissPlotResult: () => void;
  plot: Plot;
};

export default function PlotResultView({ onDismissPlotResult, plot }: Props) {
  const agent = useAppSelector((state) => state.agents.agentToAssign)!;
  const plotResult = useAppSelector((state) => state.agents.plotResult)!;

  const [isWorking, setIsWorking] = useState(false);

  const onSelectOnwards = useCallback(() => {
    setIsWorking(true);
    onDismissPlotResult();
  }, [onDismissPlotResult]);

  return (
    <div className="plot__result-container">
      <MediaSmDown>
        <div className="agent-to-assign">
          <Image alt={agent.name} icon={agent.image} type="small-icon" />
          <span className="heading heading--3 heading--close">
            {agent.name}
          </span>
        </div>
      </MediaSmDown>
      <MediaMdUp>
        <div className="agent-to-assign">
          <span className="heading heading--3 heading--close">
            {agent.name}
          </span>
        </div>
      </MediaMdUp>

      <div className="plot__result">
        <MediaMdUp>
          <div className="media__left">
            <Image
              alt={agent.name}
              className="agent-portrait"
              icon={agent.image}
              type="icon"
            />
          </div>
        </MediaMdUp>

        <div
          className={classnames(
            "plot-container",
            plot.qualityLocked && "media--locked",
            plot.currencyCost > 0 && "media--fate-locked",
            !plot.qualityLocked && plot.currencyCost === 0 && "media--message"
          )}
        >
          <div className="plot__image">
            <StoryletCard
              border
              borderColour={plot.currencyCost ? "gold" : "silver"}
              defaultCursor
              image={plotResult.image ?? ""}
              name={plotResult.name}
            />
          </div>
          <div className="plot__body">
            <div>
              <StoryletTitle name={plotResult.name} className="branch__title" />
              <StoryletDescription text={plotResult.description} />
            </div>
          </div>
        </div>
      </div>

      <div className="plot__result-effects">
        {plotResult.messages && <QualityUpdates data={plotResult.messages} />}
      </div>

      <div className="plot__preparation">
        <div className="buttons">
          <ActionButton
            go
            disabled={plot.qualityLocked}
            isWorking={isWorking}
            data={{
              requirementLocked: plot.qualityLocked,
              buttonText: "Onwards",
            }}
            onClick={onSelectOnwards}
          >
            {isWorking && <Loading spinner small />}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

PlotResultView.displayName = "PlotResultView";
