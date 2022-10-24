import { StoryletBodyProps } from "../props";
import React, { Fragment } from "react";

import StoryletButtonsAndQreqs from "components/Storylet/components/StoryletButtonsAndQreqs";
import StoryletDescription from "components/Storylet/components/StoryletDescription";
import StoryletTitle from "components/Storylet/components/StoryletTitle";

export default function StoryletBodySmUp(props: StoryletBodyProps) {
  const {
    data,
    forceClearQreqs,
    isWorking,
    name,
    onChoose,
    qualityRequirements,
    teaser,
  } = props;
  return (
    <Fragment>
      <div className="storylet__body">
        <div className="storylet__title-and-description">
          <StoryletTitle name={name} />
          <StoryletDescription text={teaser} />
        </div>
        <StoryletButtonsAndQreqs
          data={data}
          forceClearQreqs={forceClearQreqs ?? false}
          isWorking={isWorking}
          onChoose={onChoose}
          qualityRequirements={qualityRequirements}
        />
      </div>
    </Fragment>
  );
}
