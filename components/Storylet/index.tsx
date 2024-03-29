import { begin } from "actions/storylet";
import classnames from "classnames";
import StoryletCard from "components/common/StoryletCard";
import QualityRequirement from "components/QualityRequirement";
import MediaSmUp from "components/Responsive/MediaSmUp";
import MediaXsDown from "components/Responsive/MediaXsDown";
import { qreqsNeedClear } from "components/utils";
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
import { IAppState } from "types/app";
import { ApiAvailableStorylet } from "types/storylet";
import getBorderColour from "utils/getBorderColour";

import { withRouter, RouteComponentProps } from "react-router-dom";
import StoryletBodySmUp from "./components/StoryletBodySmUp";
import StoryletBodyXsDown from "./components/StoryletBodyXsDown";
import { useFeature } from "flagged";
import { FEATURE_PERSISTENT_DECK } from "features/feature-flags";
import Image from "components/Image";
import { ImageProps } from "components/Image/props";

function StoryletContainer({
  dispatch,
  data,
  history,
  isChoosing,
  badge,
  beforeHandleClick,
}: Props) {
  const { id, image, name, teaser, deckType } = data;

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
  const isPersistentDeckEnabled = useFeature(FEATURE_PERSISTENT_DECK);
  const storyletStyle =
    isPersistentDeckEnabled && deckType === "Persistent"
      ? "persistent"
      : "storylet";

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
  dispatch: Function; // eslint-disable-line
  data: ApiAvailableStorylet;
  badge?: ImageProps;
  beforeHandleClick?: (storyletId: number) => void;
}

const mapStateToProps = (state: IAppState) => ({
  isChoosing: state.storylet.isChoosing,
});

export type Props = RouteComponentProps &
  OwnProps &
  ReturnType<typeof mapStateToProps>;

export default withRouter(connect(mapStateToProps)(StoryletContainer));
