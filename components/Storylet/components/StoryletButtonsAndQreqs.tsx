import classnames from "classnames";

import ActionButton from "components/ActionButton";
import Loading from "components/Loading";
import { UI_INTEGRATION_REGEX } from "features/content-behaviour-integration/constants";
import React, { useMemo } from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import { ApiAvailableStorylet } from "types/storylet";

export interface Props {
  data: ApiAvailableStorylet;
  forceClearQreqs: boolean;
  isChoosing: boolean;
  isWorking: boolean;
  onChoose: () => void;
  qualityRequirements: React.ReactNode;
}

function StoryletButtonsAndQreqs(props: Props) {
  const {
    data,
    forceClearQreqs,
    isChoosing,
    isWorking,
    onChoose,
    qualityRequirements,
  } = props;

  const { teaser } = data;

  const label = useMemo(() => {
    const uiTriggerMatches = teaser?.match(UI_INTEGRATION_REGEX);

    if (uiTriggerMatches !== null && uiTriggerMatches !== undefined) {
      if (uiTriggerMatches.length > 2) {
        return uiTriggerMatches[2];
      }
    }

    return undefined;
  }, [teaser]);

  const buttonChildren = useMemo(() => {
    if (label) {
      return (
        <>
          <span>{label}</span>
          {isWorking && <Loading spinner small />}
        </>
      );
    }

    return isWorking && <Loading spinner small />;
  }, [isWorking, label]);

  return (
    <div
      className={classnames(
        "buttons storylet__buttons",
        forceClearQreqs && "storylet__buttons--force-clear"
      )}
    >
      <ActionButton
        disabled={isChoosing}
        isWorking={isWorking}
        go
        data={data}
        onClick={onChoose}
      >
        {buttonChildren}
      </ActionButton>
      {qualityRequirements}
    </div>
  );
}

const mapStateToProps = ({ storylet: { isChoosing } }: IAppState) => ({
  isChoosing,
});

export default connect(mapStateToProps)(StoryletButtonsAndQreqs);
