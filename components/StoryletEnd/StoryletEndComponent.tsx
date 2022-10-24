import React from "react";

import QualityUpdates from "components/QualityUpdates";
import StoryletRoot from "components/StoryletRoot";
import { IMessages } from "types/app/messages";

import AccessCode from "./components/AccessCode";
import ContinueButton from "./components/ContinueButton";

interface Props {
  accessCode?: any;
  canGoAgain: boolean;
  disabled: boolean;
  event: any;
  isGoingOnwards: boolean;
  isTryingAgain: boolean;
  messages: IMessages;
  onGoOnwards: () => Promise<void>;
  onTryAgain: () => Promise<void>;
  rootEventId: string | number | undefined;
}

export default function StoryletEndComponent({
  accessCode,
  canGoAgain,
  disabled,
  event,
  isGoingOnwards,
  isTryingAgain,
  messages,
  onGoOnwards,
  onTryAgain,
  rootEventId,
}: Props) {
  return (
    <div>
      <StoryletRoot data={event} shareData={event} rootEventId={rootEventId} />
      {accessCode && <AccessCode accessCode={accessCode} />}
      {messages && <QualityUpdates data={messages} />}
      <div className="buttons buttons--storylet-exit-options">
        <ContinueButton
          label="Onwards"
          onClick={onGoOnwards}
          disabled={disabled}
          isWorking={isGoingOnwards}
        />
        {canGoAgain && (
          <ContinueButton
            label="Try again"
            onClick={onTryAgain}
            disabled={disabled}
            isWorking={isTryingAgain}
          />
        )}
      </div>
    </div>
  );
}
