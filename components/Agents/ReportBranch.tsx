import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import { chooseBranch } from "actions/storylet";

import BranchButtons from "components/Branch/BranchButtons";
import Challenges from "components/Branch/Challenges";
import {
  StoryletCard,
  StoryletDescription,
  StoryletTitle,
} from "components/common";
import MediaMdUp from "components/Responsive/MediaMdUp";
import MediaSmDown from "components/Responsive/MediaSmDown";
import { qreqsNeedClear } from "components/utils";

import { useAppSelector } from "features/app/store";

import useIsMounted from "hooks/useIsMounted";

import { IBranch } from "types/storylet";

type Props = {
  branch: IBranch;
  onChooseBranch?: (_: any) => void;
};

export default function ReportBranch({ branch, onChooseBranch }: Props) {
  const isChoosing = useAppSelector((state) => state.storylet.isChoosing);
  const dispatch = useDispatch();

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
    setIsWorking(true);

    const branchId = branch.id;
    const qualityRequirements = branch.qualityRequirements;

    if (onChooseBranch) {
      await onChooseBranch({
        branchId,
        qualityRequirements,
        secondChanceIds,
      });
    } else {
      await dispatch(
        chooseBranch({
          branchId,
          qualityRequirements,
          secondChanceIds,
        })
      );
    }

    if (isMounted.current) {
      setIsWorking(false);
    }
  }, [branch, dispatch, isMounted, onChooseBranch, secondChanceIds]);

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

  const isLocked = branch.currencyLocked || branch.qualityLocked;

  const branchButtons = useMemo(
    () => (
      <BranchButtons
        branch={{
          ...branch,
          actionCost: 1,
        }}
        disabled={disabled}
        isPlotReport
        isWorking={isWorking}
        onChooseBranch={handleChooseBranch}
        qualityRequirements={branch.qualityRequirements}
      />
    ),
    [branch, disabled, handleChooseBranch, isWorking]
  );

  return (
    <div
      ref={ref}
      className={classnames(
        "media branch media--branch",
        isLocked && "media--locked",
        branch.currencyCost > 0 && "media--fate-locked",
        isChoosing && !isWorking && "media--semi-transparent"
      )}
      data-branch-id={branch.id}
    >
      <div className="media__left branch__left">
        <StoryletCard
          className="branch__card"
          defaultCursor
          image={branch.image}
          name={branch.name}
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
          <StoryletTitle name={branch.name} className="branch__title" />
          <MediaSmDown>
            <StoryletDescription
              text={branch.mobileDescription ?? branch.description}
            />
          </MediaSmDown>
          <MediaMdUp>
            <StoryletDescription text={branch.description} />
          </MediaMdUp>
        </div>
        {branch.currencyCost > 0 && (
          <div>
            <strong>
              This branch costs {branch.currencyCost} Fate to play.
            </strong>
          </div>
        )}
        <Challenges
          challenges={branch.challenges}
          isAgent
          locked={isLocked}
          toggleSecondChance={handleToggleSecondChance}
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

ReportBranch.displayName = "ReportBranch";
