import React from "react";
import { IEndStorylet } from "types/storylet";
import StoryletEndComponent from "components/StoryletEnd/StoryletEndComponent";
import { IMessagesObject } from "types/app/messages";

export interface Props {
  endStorylet: IEndStorylet;
  isGoingOnwards: boolean;
  isTryingAgain: boolean;
  messages: IMessagesObject;
  onGoOnwards: () => Promise<void>;
  onTryAgain: () => Promise<void>;
}

export default function End({
  isGoingOnwards,
  isTryingAgain,
  onGoOnwards,
  onTryAgain,
  messages,
  endStorylet: { canGoAgain, event, rootEventId },
}: Props) {
  return (
    <StoryletEndComponent
      disabled={false}
      canGoAgain={canGoAgain}
      onGoOnwards={onGoOnwards}
      isTryingAgain={isTryingAgain}
      onTryAgain={onTryAgain}
      event={event}
      isGoingOnwards={isGoingOnwards}
      messages={messages}
      rootEventId={rootEventId}
    />
  );
}
