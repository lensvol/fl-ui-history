import React, { useCallback, useState } from "react";

import classnames from "classnames";

import ActionButton from "components/ActionButton";
import {
  StoryletCard,
  StoryletDescription,
  StoryletTitle,
} from "components/common";
import Loading from "components/Loading";

import { Concern } from "types/agents";

type Props = {
  concern: Concern;
  header?: boolean;
  onSelectConcern: (concern: Concern) => void;
};

export default function ConcernView({
  concern,
  header,
  onSelectConcern,
}: Props) {
  const onChooseConcern = useCallback(() => {
    setIsWorking(true);
    onSelectConcern(concern);
  }, [concern, onSelectConcern]);

  const isHeaderView = header ?? false;

  const [isWorking, setIsWorking] = useState(false);

  return (
    <div
      className={classnames(
        "concern-container media--message",
        isHeaderView && "concern__header"
      )}
    >
      <div className="concern__image">
        <StoryletCard
          border
          borderColour="silver"
          defaultCursor
          image={concern.image}
          imageHeight={100}
          imageWidth={78}
          name={concern.name}
        />
      </div>
      <div className="concern__body">
        <div>
          <StoryletTitle name={concern.name} className="branch__title" />
          <StoryletDescription text={concern.description} />
        </div>
      </div>
      {!isHeaderView && (
        <div className="concern__buttons">
          <div className="buttons storylet__buttons">
            <ActionButton
              go
              isWorking={isWorking}
              data={{
                buttonText: "Consider",
              }}
              onClick={onChooseConcern}
            >
              {isWorking && <Loading spinner small />}
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
}

ConcernView.displayName = "ConcernView";
