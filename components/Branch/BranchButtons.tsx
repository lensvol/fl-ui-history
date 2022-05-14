import React from 'react';
import { connect } from 'react-redux';

import ActionButton from 'components/ActionButton';
import Loading from 'components/Loading';

import QualityRequirements from 'components/Branch/QualityRequirements';
import {
  ApiQualityRequirement,
  IBranch,
} from 'types/storylet';

interface OwnProps {
  branch :IBranch,
  disabled: boolean,
  isWorking: boolean,
  onChooseBranch: () => void,
  qualityRequirements: ApiQualityRequirement[],
}

export type Props = OwnProps;

export function BranchButtons(props: Props) {
  const {
    branch,
    disabled,
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
        data={branch}
        onClick={onChooseBranch}
      >
        {isWorking && <Loading spinner small />}
      </ActionButton>
      <QualityRequirements requirements={qualityRequirements} />
    </div>
  );
}

BranchButtons.displayName = 'BranchButtons';

export default connect()(BranchButtons);