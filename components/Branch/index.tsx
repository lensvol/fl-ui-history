import { UI_INTEGRATION_REGEX } from "features/content-behaviour-integration/constants";
import { COMMAND_MAP } from "features/content-behaviour-integration/integration";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import classnames from "classnames";
import { qreqsNeedClear } from "components/utils";
import { chooseBranch } from "actions/storylet";
import { shouldFetch as shouldUpdateOpportunities } from "actions/cards";
import useIsMounted from "hooks/useIsMounted";
import {
  StoryletCard,
  StoryletDescription as Description,
  StoryletTitle as Title,
} from "components/common";
import { Frequency, IBranch } from "types/storylet";
import { IAppState } from "types/app";
import BranchButtons from "./BranchButtons";
import Challenges from "./Challenges";
import PlanButtonlet from "./PlanButtonlet";

const MAX_ACTIVE_PLANS = 20;

export interface State {
  isWorking: boolean;
  secondChanceIds: number[];
}

export function Branch({
  actions,
  activePlans,
  branch,
  defaultCursor,
  dispatch,
  history,
  isChoosing,
  isGoingBack,
  onChooseBranch,
  storyletFrequency,
}: Props) {
  const {
    actionCost,
    challenges,
    currencyCost,
    currencyLocked,
    description,
    id,
    image,
    name,
    qualityLocked,
    qualityRequirements,
  } = branch;

  const ref = useRef<HTMLDivElement>(null);
  const [forceClearQreqs, setForceClearQreqs] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [secondChanceIds, setSecondChanceIds] = useState<number[]>([]);
  const isMounted = useIsMounted();

  const onResize = useCallback(() => {
    if (!ref.current) {
      return;
    }
    setForceClearQreqs(qreqsNeedClear(ref.current));
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  const handleChooseBranch = useCallback(async () => {
    // Check whether we should be making some UI changes instead
    const uiTriggerMatches = description.match(UI_INTEGRATION_REGEX);
    if ((uiTriggerMatches?.length ?? 0) > 0) {
      const commandAction =
        uiTriggerMatches?.[1] === undefined
          ? undefined
          : COMMAND_MAP[uiTriggerMatches?.[1]];
      if (commandAction) {
        dispatch(commandAction(history));
        return;
      }
    }

    const { id: branchId } = branch;
    if (storyletFrequency === "Sometimes") {
      dispatch(shouldUpdateOpportunities());
    }

    setIsWorking(true);

    if (onChooseBranch) {
      await onChooseBranch({ branchId, qualityRequirements, secondChanceIds });
    } else {
      await dispatch(
        chooseBranch({ branchId, qualityRequirements, secondChanceIds })
      );
    }

    if (isMounted.current) {
      setIsWorking(false);
    }
  }, [
    branch,
    description,
    dispatch,
    history,
    isMounted,
    onChooseBranch,
    qualityRequirements,
    secondChanceIds,
    storyletFrequency,
  ]);

  const handleToggleSecondChance = useCallback(
    (checked: boolean, secondChanceId: number) => {
      if (checked) {
        setSecondChanceIds([...secondChanceIds, secondChanceId]);
        return;
      }
      const newIds = secondChanceIds.filter((e) => e !== secondChanceId);
      setSecondChanceIds(newIds);
    },
    [secondChanceIds]
  );

  const disabled = isChoosing || isWorking;

  // Compare actions to action cost directly
  const isLocked = actions < actionCost || currencyLocked || qualityLocked;

  // Is a player maxed out on active plans?
  const playerHasMaximumActivePlans =
    activePlans && activePlans.length >= MAX_ACTIVE_PLANS;

  const branchButtons = useMemo(
    () => (
      <BranchButtons
        branch={branch}
        disabled={disabled}
        isWorking={isWorking}
        onChooseBranch={handleChooseBranch}
        qualityRequirements={qualityRequirements}
      />
    ),
    [branch, disabled, handleChooseBranch, isWorking, qualityRequirements]
  );

  return (
    <div
      ref={ref}
      className={classnames(
        "media branch media--branch",
        isLocked && "media--locked",
        currencyCost > 0 && "media--fate-locked",
        (isGoingBack || isChoosing) && !isWorking && "media--semi-transparent"
      )}
      data-branch-id={id}
    >
      <div className="media__left branch__left">
        <StoryletCard
          className="branch__card"
          defaultCursor={defaultCursor}
          image={image}
          name={name}
          imageWidth={78}
          imageHeight={100}
        />
      </div>
      <div
        className={classnames(
          "media__body branch__body",
          forceClearQreqs && "branch__body--force-clear-qreqs"
        )}
      >
        <div>
          <div className="branch__plan-buttonlet">
            <PlanButtonlet
              branch={branch}
              playerHasMaximumActivePlans={playerHasMaximumActivePlans}
            />
          </div>
          <Title name={name} className="branch__title" />
          <Description text={description} />
        </div>
        {currencyCost > 0 && (
          <div>
            <strong>This branch costs {currencyCost} Fate to play.</strong>
          </div>
        )}
        <Challenges
          challenges={challenges}
          toggleSecondChance={handleToggleSecondChance}
          locked={isLocked}
        />
        {/*
          If the screen is wide enough to keep qreqs to the right,
          then render them inside the body
        */}
        {!forceClearQreqs && branchButtons}
      </div>
      {/*
          If we need to drop the qreqs below the body to fit on fewer lines,
          then render them here instead
      */}
      {forceClearQreqs && (
        <div
          className="storylet__buttons--force-clear"
          style={{ width: "100%" }}
        >
          {branchButtons}
        </div>
      )}
    </div>
  );
}

Branch.displayName = "Branch";

type OwnProps = {
  branch: IBranch;
  defaultCursor?: boolean;
  dispatch: Function; // eslint-disable-line
  isGoingBack?: boolean;
  onChooseBranch?: (_: any) => Promise<void>;
  storyletFrequency?: Frequency;
};

const mapStateToProps = ({
  actions: { actions },
  plans: { activePlans },
  storylet: { isChoosing },
}: IAppState) => ({
  actions,
  activePlans,
  isChoosing,
});

type Props = ReturnType<typeof mapStateToProps> &
  RouteComponentProps &
  OwnProps;

export default withRouter(connect(mapStateToProps)(Branch));
