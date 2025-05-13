import React from "react";

import ActionButton from "components/ActionButton";
import QualityRequirements from "components/Branch/QualityRequirements";
import Loading from "components/Loading";

import { ApiQualityRequirement, IBranch } from "types/storylet";

export type Props = {
  branch: IBranch;
  disabled: boolean;
  isPlotReport?: boolean;
  isWorking: boolean;
  onChooseBranch: () => void;
  qualityRequirements: ApiQualityRequirement[];
};

export default function BranchButtons(props: Props) {
  const {
    branch,
    disabled,
    isPlotReport,
    isWorking,
    onChooseBranch,
    qualityRequirements,
  } = props;

  return (
    <div className="buttons storylet__buttons">
      <ActionButton
        // @ts-ignore
        go
        disabled={disabled}
        isWorking={isWorking}
        data={{
          ...branch,
          isPlotReport: isPlotReport ?? false,
        }}
        onClick={onChooseBranch}
      >
        {isWorking && <Loading spinner small />}
      </ActionButton>
      <QualityRequirements requirements={qualityRequirements} />
    </div>
  );
}

BranchButtons.displayName = "BranchButtons";
