import React, { Fragment } from "react";
import { StoryletBodyProps } from "../props";
import StoryletButtonsAndQreqs from "components/Storylet/components/StoryletButtonsAndQreqs";
import StoryletDescription from "components/Storylet/components/StoryletDescription";
import StoryletTitle from "components/Storylet/components/StoryletTitle";

export default function StoryletBodyXsDown(props: StoryletBodyProps) {
  const { forceClearQreqs, name, teaser } = props;
  return (
    <Fragment>
      <div className="storylet__body">
        <StoryletTitle name={name} />
        <StoryletDescription text={teaser} />
        {!forceClearQreqs && <Buttons {...props} />}
      </div>
      {forceClearQreqs && <Buttons {...props} />}
    </Fragment>
  );
}

const Buttons = ({
  data,
  forceClearQreqs,
  isWorking,
  onChoose,
  qualityRequirements,
}: StoryletBodyProps) => (
  <StoryletButtonsAndQreqs
    data={data}
    forceClearQreqs={forceClearQreqs ?? false}
    isWorking={isWorking}
    onChoose={onChoose}
    qualityRequirements={qualityRequirements}
  />
);
