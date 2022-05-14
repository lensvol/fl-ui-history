import useIsMounted from 'hooks/useIsMounted';
import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { connect } from 'react-redux';

import { createPlan, deletePlan, } from 'actions/storylet';

import Buttonlet from 'components/Buttonlet';
import { IBranch } from "types/storylet";
import { IAppState } from 'types/app';

export interface OwnProps {
  branch: IBranch,
  playerHasMaximumActivePlans: boolean,
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & {
  dispatch: Function,
};

function PlanButtonlet({
  activePlans,
  branch,
  dispatch,
  playerHasMaximumActivePlans,
}: Props) {
  const {
    id: branchId,
  } = branch;

  const isMounted = useIsMounted();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClickToAdd = useCallback(async () => {
    // TODO: use something other than an alert here
    if (playerHasMaximumActivePlans) {
      alert('Unfortunately, you already have the maximum number of active plans.'); // eslint-disable-line no-alert
      return;
    }
    setIsSubmitting(true);
    await dispatch(createPlan(branch));
    if (isMounted.current) {
      setIsSubmitting(false);
    }
  }, [
    branch,
    dispatch,
    isMounted,
    playerHasMaximumActivePlans,
  ]);

  const onClickToRemove = useCallback(async () => {
    setIsSubmitting(true);
    await dispatch(deletePlan(branchId));
    if (isMounted.current) {
      setIsSubmitting(false);
    }
  }, [
    branchId,
    dispatch,
    isMounted,
  ]);

  const isBranchPlanned = useMemo(() => !!activePlans.find(plan => plan.branch.id === branch.id), [
    activePlans,
    branch.id,
  ]);

  // If the user currently has this branch as an active plan,
  // show it as active
  if (isBranchPlanned) {
    return (
      <Buttonlet
        type="plan--active"
        title="Remove this choice from your plans"
        onClick={onClickToRemove}
        disabled={isSubmitting}
      />
    );
  }

  // If the user has planned and completed this branch,
  // render a restart option
  if (branch.planState === 'Complete') {
    return (
      <Buttonlet
        type="check"
        title="You have completed this plan; click to restart it"
        onClick={onClickToAdd}
        disabled={isSubmitting}
      />
    );
  }

  // Render a mark-as-plan option
  return (
    <Buttonlet
      type="plan"
      title="Mark this choice as a plan"
      onClick={onClickToAdd}
      disabled={isSubmitting}
    />
  );
}

const mapStateToProps = ({ plans: { activePlans } }: IAppState) => ({ activePlans });

export default connect(mapStateToProps)(PlanButtonlet);