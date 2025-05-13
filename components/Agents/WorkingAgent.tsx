import React, { useCallback } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import abandonPlot from "actions/agents/abandonPlot";
import hearReport from "actions/agents/hearReport";

import AgentInventory from "components/Agents/AgentInventory";
import { StoryletDescription, StoryletTitle } from "components/common";
import StoryletCard from "components/common/StoryletCard";
import Image from "components/Image";
import MediaMdUp from "components/Responsive/MediaMdUp";
import MediaSmDown from "components/Responsive/MediaSmDown";

import { Agent } from "types/agents";

type Props = {
  agent: Agent;
};

export default function WorkingAgent({ agent }: Props) {
  const noOp = () => {};
  const dispatch = useDispatch();

  const totalActions = agent.plot?.duration ?? 0;
  const elapsedActions = agent.plot?.elapsed ?? 0;
  const canAbandon = agent.plot?.canAbandon ?? false;

  const onAbandonPlot = useCallback(async () => {
    await dispatch(abandonPlot(agent.id));
  }, [agent, dispatch]);

  const onHearReport = useCallback(async () => {
    await dispatch(hearReport(agent.id));
  }, [agent, dispatch]);

  if (!agent.plot) {
    return null;
  }

  return (
    <div className="working-agent">
      <div className="agent-header-row">
        <MediaSmDown>
          <div className="agent-to-assign">
            <Image alt={agent.name} icon={agent.image} type="small-icon" />
            <span className="heading heading--2 heading--close">
              {agent.name}
            </span>
          </div>
        </MediaSmDown>
        <MediaMdUp>
          <div className="agent-assigned">
            <span className="heading heading--2 heading--close agent-header">
              {agent.name}
            </span>
          </div>
        </MediaMdUp>
      </div>

      <div className="plot__result">
        <div className="media__left">
          <Image
            alt={agent.name}
            className="agent-portrait"
            icon={agent.image}
            type="icon"
          />
        </div>
        <div
          className={classnames(
            "plot-container",
            agent.plot.qualityLocked && "media--locked",
            agent.plot.currencyCost > 0 && "media--fate-locked",
            !agent.plot.qualityLocked &&
              agent.plot.currencyCost === 0 &&
              "media--message"
          )}
        >
          <div className="plot__image">
            <StoryletCard
              border
              borderColour={agent.plot.currencyCost ? "gold" : "silver"}
              defaultCursor
              image={agent.plot.image}
              name={agent.plot.name}
            />
          </div>
          <div className="plot__body">
            <div>
              <StoryletTitle name={agent.plot.name} className="branch__title" />
              <StoryletDescription text={agent.plot.description} />
            </div>
          </div>
        </div>
      </div>

      {elapsedActions < totalActions && (
        <div>
          <div className="progress-bar">
            <span
              className="progress-bar__stripe progress-bar__stripe--has-transition"
              style={{
                width: `${Number((elapsedActions / totalActions) * 100) || 0}%`,
              }}
            />
          </div>
          <div className="working-agent-elapsed-actions">
            {elapsedActions}/{totalActions}: {totalActions - elapsedActions}{" "}
            actions before your agent returns
          </div>
        </div>
      )}

      <div className="working-agent-footer-row">
        <AgentInventory
          agent={agent}
          setInventoryAgent={noOp}
          setInventoryCategory={noOp}
          setInventoryOptions={noOp}
          setIsInventoryPickerOpen={noOp}
        />

        <div className="agent-footer-buttons">
          {elapsedActions < totalActions ? (
            canAbandon && (
              <button
                className={
                  elapsedActions <= 5
                    ? "agent-assign-button"
                    : "agent-unassign-button"
                }
                onClick={onAbandonPlot}
                type="button"
              >
                Abandon Plot
              </button>
            )
          ) : (
            <button
              className="agent-assign-button"
              onClick={onHearReport}
              type="button"
            >
              Receive Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

WorkingAgent.displayName = "WorkingAgent";
