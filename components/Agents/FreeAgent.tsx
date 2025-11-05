import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

import classnames from "classnames";

import fetchPlots from "actions/agents/fetchPlots";
import takeAllFromAgent from "actions/agents/takeAllFromAgent";

import AgentInventory from "components/Agents/AgentInventory";
import AgentLevelView from "components/Agents/AgentLevelView";
import Image from "components/Image";
import Loading from "components/Loading";

import { useAppSelector } from "features/app/store";

import { Agent } from "types/agents";
import { IQuality } from "types/qualities";

type Props = {
  agent: Agent;
  isChanging: boolean;
  setInventoryAgent: (newState?: Agent) => void;
  setInventoryCategory: (newState: string) => void;
  setInventoryOptions: (newState: IQuality[]) => void;
  setIsInventoryPickerOpen: (newState: boolean) => void;
};

export default function FreeAgent({
  agent,
  isChanging,
  setInventoryAgent,
  setInventoryCategory,
  setInventoryOptions,
  setIsInventoryPickerOpen,
}: Props) {
  const dispatch = useDispatch();

  const isButtonDisabled = useAppSelector(
    (state) =>
      state.agents.agents.filter((agent) => agent.plot !== undefined).length >=
      state.agents.maxPlots
  );

  const isFetchingPlots = useAppSelector(
    (state) => state.agents.isFetchingPlots
  );

  const onClickClear = useCallback(async () => {
    await dispatch(takeAllFromAgent(agent.id));
  }, [agent, dispatch]);

  const onClickAssign = useCallback(async () => {
    await dispatch(fetchPlots(agent.id));
  }, [agent, dispatch]);

  const basicAbilityLevels = agent.levels.filter(
    (level) => level.category === "BasicAbility"
  );
  const otherLevels = agent.levels.filter(
    (level) => level.category !== "BasicAbility" && level.category !== "Hidden"
  );
  const firstOtherLevel = otherLevels.find(() => true);
  const remainingLevels = otherLevels.slice(1);

  return (
    <div className="free-agent">
      <div className="agent-header-row">
        <h2 className="heading heading--2 agent-header">{agent.name}</h2>
      </div>

      <div className="agent-body-row">
        <div className="agent-summary">
          <div className="media__left">
            <Image
              alt={agent.name}
              className="agent-portrait"
              icon={agent.image}
              type="icon"
            />
          </div>
          <div>
            <span dangerouslySetInnerHTML={{ __html: agent.description }} />
            <div>
              <strong className="agent-stat-bonus">
                {agent.levels
                  .filter((level) => level.level > 0)
                  .map(
                    (level) =>
                      `${level.name} ${level.level > 0 && "+"}${level.level}`
                  )
                  .join(", ")}
              </strong>
            </div>
          </div>
        </div>
        <div className="agent-details">
          {agent.levels.length > 0 && (
            <div className="agent-stat-container">
              {basicAbilityLevels.map((level) => (
                <AgentLevelView key={level.id} level={level} />
              ))}

              {firstOtherLevel && (
                <AgentLevelView
                  key={firstOtherLevel.id}
                  className="agent-stat-new-row"
                  level={firstOtherLevel}
                />
              )}

              {remainingLevels.map((level) => (
                <AgentLevelView key={level.id} level={level} />
              ))}
            </div>
          )}
          <hr />
          <div className="free-agent-footer-row">
            <AgentInventory
              agent={agent}
              editable
              isChanging={isChanging}
              setInventoryAgent={setInventoryAgent}
              setInventoryCategory={setInventoryCategory}
              setInventoryOptions={setInventoryOptions}
              setIsInventoryPickerOpen={setIsInventoryPickerOpen}
            />
            <div className="agent-footer-buttons">
              <button
                className="agent-assign-button"
                onClick={onClickClear}
                type="button"
              >
                {isFetchingPlots ? <Loading spinner small /> : "Unequip"}
              </button>{" "}
              <button
                className={classnames(
                  "agent-assign-button",
                  isButtonDisabled && "button--disabled"
                )}
                disabled={isButtonDisabled}
                onClick={onClickAssign}
                type="button"
              >
                {isFetchingPlots ? <Loading spinner small /> : "Assign"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

FreeAgent.displayName = "FreeAgent";
