import React, { useCallback, useState } from "react";

import { useDispatch } from "react-redux";

import { unhideAgentAlert } from "actions/agents/agentAlert";
import chooseReportBranch from "actions/agents/chooseReportBranch";
import fetchAgents from "actions/agents/fetchAgents";
import perhapsNot from "actions/agents/perhapsNot";

import ReportBranch from "components/Agents/ReportBranch";
import Image from "components/Image";
import QualityUpdates from "components/QualityUpdates";
import MediaMdUp from "components/Responsive/MediaMdUp";
import MediaSmDown from "components/Responsive/MediaSmDown";
import ContinueButton from "components/StoryletEnd/components/ContinueButton";
import GoBack from "components/StoryletIn/GoBack";
import StoryletRoot from "components/StoryletRoot";

import { useAppSelector } from "features/app/store";

import { IChooseReportBranchRequestData } from "services/AgentsService";

import { IBranch } from "types/storylet";

export default function AgentReportView() {
  const report = useAppSelector((state) => state.agents.report);
  const storylet = report?.storylet;
  const endStorylet = report?.endStorylet;
  const isInStorylet = storylet !== undefined && report?.phase === "In";
  const isEndStorylet = endStorylet !== undefined && report?.phase === "End";
  const agent = useAppSelector((state) =>
    state.agents.agents.find((a) => a.id === report?.agentId)
  );

  const dispatch = useDispatch();

  const [isWorking, setIsWorking] = useState(false);

  const onGoOnwards = useCallback(async () => {
    setIsWorking(true);

    await dispatch(fetchAgents());

    if (agent) {
      dispatch(unhideAgentAlert(agent.id));
    }

    setIsWorking(false);
  }, [agent, dispatch]);

  const onChooseBranch = useCallback(
    async (branchData: IBranch & IChooseReportBranchRequestData) => {
      if (branchData) {
        await dispatch(chooseReportBranch(branchData));
      }
    },
    [dispatch]
  );

  const onGoBack = useCallback(async () => {
    setIsWorking(true);

    await dispatch(perhapsNot(agent!.id));

    setIsWorking(false);
  }, [agent, dispatch]);

  if (!agent || !report || (!isInStorylet && !isEndStorylet)) {
    return null;
  }

  return (
    <div className="agent-report-view">
      <h1 className="heading heading--1 heading--close">Agents</h1>
      <hr />
      <div className="agent-report">
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
          {isInStorylet && (
            <StoryletRoot data={storylet!} shareData={undefined} />
          )}
          {isEndStorylet && (
            <StoryletRoot
              data={endStorylet!.event}
              shareData={undefined}
              rootEventId={endStorylet!.rootEventId}
            />
          )}
        </div>

        {isInStorylet && (
          <>
            <div className="agent-report-branch-container">
              {storylet!.childBranches.map((branch) => (
                <ReportBranch
                  branch={branch}
                  key={branch.id}
                  onChooseBranch={onChooseBranch}
                />
              ))}
            </div>
            <div className="buttons buttons--left buttons--storylet-exit-options">
              <GoBack
                disabled={isWorking}
                onClick={onGoBack}
                storylet={storylet!}
                isGoingBack={isWorking}
              />
            </div>
          </>
        )}
        {isEndStorylet && (
          <div>
            {report.messages && <QualityUpdates data={report.messages} />}

            <div className="buttons buttons--storylet-exit-options">
              <ContinueButton
                label="Onwards"
                onClick={onGoOnwards}
                disabled={isWorking}
                isWorking={isWorking}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

AgentReportView.displayName = "AgentReportView";
