import React, { useCallback, useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { hideAgentAlert } from "actions/agents/agentAlert";

import Buttonlet from "components/Buttonlet";
import Image from "components/Image";

import { useAppDispatch, useAppSelector } from "features/app/store";

export default function AgentAlert() {
  const dispatch = useAppDispatch();

  const [timerWidthPercent, setTimerWidthPercent] = useState(100);

  const agent = useAppSelector((state) =>
    state.agents.agents
      .filter(
        (agent) =>
          agent.plot &&
          agent.plot.duration <= (agent.plot.elapsed ?? 0) &&
          !state.agents.hideAlertIds.includes(agent.id)
      )
      .sort((agent) => agent.id) // TODO: determine proper sort algorithm
      .find((a) => a)
  );

  const dismiss = useCallback(() => {
    if (!agent) {
      return;
    }

    setTimerWidthPercent(100);
    dispatch(hideAgentAlert(agent.id));
  }, [dispatch, agent]);

  useEffect(() => {
    if (!agent) {
      return;
    }

    const durationInMillis = 10 * 1000;
    const intervalInMillis = 100;
    const widthIncrement = (100 / durationInMillis) * intervalInMillis;

    const timer = setTimeout(() => {
      setTimerWidthPercent(timerWidthPercent - widthIncrement);
    }, intervalInMillis);

    if (timerWidthPercent <= 0) {
      dismiss();
    }

    return () => clearTimeout(timer); // Cleanup the timer
  }, [agent, dismiss, timerWidthPercent]);

  if (!agent) {
    return null;
  }

  return (
    <div className="self-dismissing-alert-container">
      <div className="alert-content">
        <Buttonlet
          classNames={{
            containerClassName: "alert-close-button",
          }}
          onClick={dismiss}
          type="close"
        />
        <div
          style={{
            display: "flex",
            marginBottom: "8px",
            marginRight: "28px",
          }}
        >
          <Image
            className="bordered-alert-component"
            icon={agent.image}
            type="small-icon"
            height={40}
            width={40}
          />
          <div>
            <div className="heading heading--2">
              {agent.name} has completed a Plot.
            </div>
          </div>
        </div>
        <p
          style={{
            marginBottom: 0,
          }}
        >
          Their report awaits on the{" "}
          <Link onClick={dismiss} to="/agents" title="Agents">
            Agents
          </Link>{" "}
          tab.
        </p>
      </div>

      <div className="alert-progress">
        <div
          className="alert-progress-bar"
          style={{
            width: `${timerWidthPercent}%`,
          }}
        />
      </div>
    </div>
  );
}

AgentAlert.displayName = "AgentAlert";
