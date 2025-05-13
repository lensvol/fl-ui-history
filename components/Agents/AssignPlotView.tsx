import React, { useCallback, useState } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import lendToAgent from "actions/agents/lendToAgent";
import takeFromAgent from "actions/agents/takeFromAgent";

import ActionButton from "components/ActionButton";
import AgentInventory from "components/Agents/AgentInventory";
import AgentInventoryPlotItemPicker from "components/Agents/AgentInventoryPlotItemPicker";
import PlotHintView from "components/Agents/PlotHintView";
import {
  StoryletCard,
  StoryletDescription,
  StoryletTitle,
} from "components/common";
import Image from "components/Image";
import Loading from "components/Loading";

import { useAppSelector } from "features/app/store";

import { IQuality } from "types/qualities";

type Props = {
  onDismissPlot: () => void;
  onSendOff: () => void;
  plotId: number;
};

export default function AssignPlotView({
  onDismissPlot,
  onSendOff,
  plotId,
}: Props) {
  const dispatch = useDispatch();
  const agents = useAppSelector((state) => state.agents.agents);
  const agent = useAppSelector((state) => state.agents.agentToAssign)!;
  const outfit = useAppSelector((state) => state.outfit);

  const plot = useAppSelector((state) =>
    state.agents.concerns.flatMap((concern) => concern.plots)
  ).find((plot) => plot.id === plotId)!;

  const [inventoryCategory, setInventoryCategory] = useState<string>("");
  const [inventoryOptions, setInventoryOptions] = useState<IQuality[]>([]);
  const [isInventoryPickerOpen, setIsInventoryPickerOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const isTutoritalPlot = plot.id === 6; // TODO: magic number
  const isInventoryEmpty = agent.inventory.length === 0;
  const isPresentingTutorial = isTutoritalPlot && isInventoryEmpty;

  const onBeginPlot = useCallback(() => {
    setIsWorking(true);
    onSendOff();
  }, [onSendOff]);

  const handleRequestClose = useCallback(() => {
    setIsInventoryPickerOpen(false);
  }, []);

  const handleChoose = useCallback(
    async (category: string, quality?: IQuality) => {
      if (agent === undefined) {
        return;
      }

      setIsChanging(true);

      if (quality) {
        const borrowers = agents.filter((a) =>
          a.inventory.map((i) => i.id).includes(quality.id)
        );
        const workingAgentCount = borrowers.filter((b) => b.plot).length;
        const unclaimedCount = quality.level - borrowers.length - 1;
        const wornItemId = outfit.slots[category]?.id;

        const shouldFetchOutfit =
          wornItemId === quality.id &&
          unclaimedCount <= 0 &&
          workingAgentCount < quality.level &&
          (borrowers.length === 0 || borrowers.length === workingAgentCount);

        await dispatch(
          lendToAgent(agent.id, quality.id, shouldFetchOutfit, plotId)
        );
      } else {
        await dispatch(takeFromAgent(agent.id, category, plotId));
      }

      setIsChanging(false);
    },
    [agent, agents, dispatch, outfit, plotId]
  );

  return (
    <>
      <div className="agent-to-assign">
        <Image alt={agent.name} icon={agent.image} type="small-icon" />
        <span className="heading heading--3 heading--close">
          Assigning: {agent.name}
        </span>
      </div>

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
          {plot.currencyCost > 0 && (
            <div>
              <strong>
                This plot costs {plot.currencyCost.toLocaleString("en-GB")} Fate
                to play.
              </strong>
            </div>
          )}
        </div>
      </div>
      <div className="plot__preparation">
        <div className="plot__summary-container">
          <div className="plot__hint-container">
            {plot.hints.map((hint) => (
              <PlotHintView
                key={hint.id}
                level={agent.levels.find((level) => level.name === hint.name)}
                hint={hint}
              />
            ))}
          </div>
          {isTutoritalPlot && (
            <div className="plot__tutorial">
              You can loan your agent items to aid in their task. Items loaned
              to agents will be unavailable to you until the Plot has concluded.
            </div>
          )}
          <div className="agent-assign-footer-row">
            <AgentInventory
              agent={agent}
              editable
              isChanging={isChanging}
              setInventoryAgent={() => {}}
              setInventoryCategory={setInventoryCategory}
              setInventoryOptions={setInventoryOptions}
              setIsInventoryPickerOpen={setIsInventoryPickerOpen}
            />
          </div>
          <div className="plot__duration">
            Your agent will return in {plot.duration} actions.
          </div>
          {isPresentingTutorial && (
            <div className="plot__tutorial-alert">
              Equip at least one item to your agent.
            </div>
          )}
        </div>
        <div className="plot__launch-buttons buttons">
          <button
            className={classnames("agent-assign-button")}
            onClick={onDismissPlot}
            type="button"
          >
            <i className="fa fa-arrow-left" /> Perhaps not
          </button>
          <ActionButton
            go
            disabled={
              plot.currencyLocked || plot.qualityLocked || isPresentingTutorial
            }
            data={{
              currencyLocked: plot.currencyLocked,
              requirementLocked: plot.qualityLocked,
              buttonText: "Send off",
            }}
            onClick={onBeginPlot}
          >
            {isWorking && <Loading spinner small />}
          </ActionButton>
        </div>
      </div>

      <AgentInventoryPlotItemPicker
        agent={agent}
        agents={agents}
        header={inventoryCategory}
        hints={plot.hints}
        isOpen={isInventoryPickerOpen}
        onChoose={handleChoose}
        onRequestClose={handleRequestClose}
        qualities={inventoryOptions}
      />
    </>
  );
}

AssignPlotView.displayName = "AssignPlotView";
