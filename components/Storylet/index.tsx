import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useDispatch } from "react-redux";

import { RouteComponentProps, withRouter } from "react-router-dom";

import classnames from "classnames";

import { begin } from "actions/storylet";

import StoryletCard from "components/common/StoryletCard";
import Image from "components/Image";
import { ImageProps } from "components/Image/props";
import QualityRequirement from "components/QualityRequirement";
import MediaSmUp from "components/Responsive/MediaSmUp";
import MediaXsDown from "components/Responsive/MediaXsDown";
import StoryletBodySmUp from "components/Storylet/components/StoryletBodySmUp";
import StoryletBodyXsDown from "components/Storylet/components/StoryletBodyXsDown";
import { qreqsNeedClear } from "components/utils";

import { useAppSelector } from "features/app/store";
import { UI_INTEGRATION_REGEX } from "features/content-behaviour-integration/constants";
import { COMMAND_MAP } from "features/content-behaviour-integration/integration";

import { ApiAvailableStorylet } from "types/storylet";

import getBorderColour from "utils/getBorderColour";

function StoryletContainer({ data, history, badge, beforeHandleClick }: Props) {
  const { id, image, name, teaser, deckType } = data;

  const dispatch = useDispatch();
  const isChoosing = useAppSelector((state) => state.storylet.isChoosing);

  const ref = useRef<HTMLDivElement>(null);

  const [shouldClearQReqs, setShouldClearQReqs] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  const commandAction = useMemo(() => {
    // Check whether we have a special UI token in the teaser
    const uiTriggerMatches = teaser?.match(UI_INTEGRATION_REGEX);

    if ((uiTriggerMatches?.length ?? 0) > 1) {
      const commandMatch = uiTriggerMatches?.[1];

      if (commandMatch !== undefined) {
        return COMMAND_MAP[commandMatch];
      }
    }

    return undefined;
  }, [teaser]);

  const handleChoose = useCallback(() => {
    beforeHandleClick?.(id);

    if (commandAction) {
      dispatch(commandAction(history));

      return;
    }

    setIsWorking(true);
    dispatch(begin(id));
  }, [beforeHandleClick, commandAction, dispatch, history, id]);

  const borderColour = getBorderColour(data);

  const onResize = useCallback(() => {
    if (ref.current) {
      setShouldClearQReqs(qreqsNeedClear(ref.current));
    }
  }, []);

  const qualityRequirements = useMemo(
    () =>
      [...data.qualityRequirements]
        .reverse()
        .map((quality) => (
          <QualityRequirement key={quality.qualityId} data={quality} storylet />
        )),
    [data.qualityRequirements]
  );

  useEffect(() => {
    window.addEventListener("resize", onResize);

    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  const onCardClick = handleChoose;
  const forceClearQreqs = shouldClearQReqs;
  const storyletStyle = deckType === "Persistent" ? "persistent" : "storylet";

  return (
    <div
      className={classnames(
        "media",
        storyletStyle,
        isChoosing && !isWorking && "storylet--semi-transparent"
      )}
      data-branch-id={data.id}
      ref={ref}
    >
      <div className="storylet__left">
        <StoryletCard
          borderColour={borderColour}
          image={image}
          name={name}
          onClick={onCardClick}
        />
      </div>
      <MediaXsDown>
        <StoryletBodyXsDown
          data={data}
          forceClearQreqs={forceClearQreqs}
          isWorking={isWorking}
          name={name}
          onChoose={handleChoose}
          qualityRequirements={qualityRequirements}
          teaser={teaser ?? ""}
        />
      </MediaXsDown>
      <MediaSmUp>
        <StoryletBodySmUp
          data={data}
          forceClearQreqs={forceClearQreqs}
          isWorking={isWorking}
          name={name}
          onChoose={handleChoose}
          qualityRequirements={qualityRequirements}
          teaser={teaser ?? ""}
        />
      </MediaSmUp>
      {badge && <Image {...badge} />}
    </div>
  );
}

StoryletContainer.displayName = "StoryletContainer";

interface OwnProps {
  data: ApiAvailableStorylet;
  badge?: ImageProps;
  beforeHandleClick?: (storyletId: number) => void;
}

export type Props = RouteComponentProps & OwnProps;

export default withRouter(StoryletContainer);
