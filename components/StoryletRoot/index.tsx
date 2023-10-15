import React, { useCallback, useRef, useState } from "react";
import { connect } from "react-redux";

import Config from "configuration";

import { shareContent } from "features/profile";
import getBorderColour from "utils/getBorderColour";
import { stripHtml } from "utils/stringFunctions";

import Buttonlet from "components/Buttonlet";
import Image from "components/Image";
import ShareDialog from "components/ShareDialog";

import { StoryletRootData } from "types/storylet";
import { IAppState } from "types/app";
import { StoryletDescription } from "components/common";
import FrequencyButtonlet from "./FrequencyButtonlet";

export function StoryletRoot(props: Props) {
  const {
    data,
    dispatch,
    isChoosing,
    isGoingBack,
    privilegeLevel,
    rootEventId,
    shareData,
  } = props;

  const { category, isAutofire } = data;

  // We may not actually have any shareData to deal with
  const shareDataId = shareData?.id;
  const shareDataImage = shareData?.image;

  const [isSharing, setIsSharing] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareMessageResponse, setShareMessageResponse] = useState<
    string | undefined
  >();

  const element = useRef<HTMLDivElement>(null);

  const addToJournal = useCallback(
    async (message: any) => {
      setIsSharing(true);

      const result = await dispatch(
        shareContent({
          contentClass: "EventConclusion",
          contentKey: shareDataId,
          image: shareDataImage,
          message: stripHtml(message),
        })
      );

      setShareMessageResponse(result.data.message);

      setIsSharing(false);

      return result;
    },
    [dispatch, shareDataId, shareDataImage]
  );

  const closeJournalDialog = useCallback(() => {
    setShareDialogOpen(false);
  }, []);

  const openShareDialog = useCallback(() => {
    setShareDialogOpen(true);
  }, []);

  return (
    <div
      className="media media--root"
      style={{ marginBottom: "18px" }}
      ref={element}
    >
      <div className="media__left">
        <div className="storylet-root__card">
          <Image
            className="media__object storylet-root__card-image"
            icon={data && data.image}
            alt={data.name}
            type="icon"
            border={getBorderColour({ isAutofire, category })}
            defaultCursor
          />
        </div>
      </div>
      <div className="media__body">
        <div className="storylet-root__frequency">
          {shareData && (
            <Buttonlet
              type="edit"
              onClick={openShareDialog}
              disabled={isChoosing || isGoingBack}
            />
          )}
        </div>
        {data.deckType === "Sometimes" && data.distribution !== undefined && (
          <div className="storylet-root__frequency">
            <FrequencyButtonlet frequency={data.distribution} />
          </div>
        )}
        <h1
          className="media__heading heading heading--2 storylet-root__heading"
          dangerouslySetInnerHTML={{ __html: data.name }}
        />
        <StoryletDescription
          containerClassName="storylet-root__description-container"
          text={data.description}
        />
        {privilegeLevel === "Admin" && (
          <a
            className="button button--primary"
            href={`${Config.cmsUrl}Storying/EditRoot?rootEventId=${rootEventId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Edit this storylet
          </a>
        )}
        {shareData && (
          <ShareDialog
            shareMessageResponse={shareMessageResponse}
            data={shareData}
            isSharing={isSharing}
            isOpen={shareDialogOpen}
            onSubmit={addToJournal}
            onRequestClose={closeJournalDialog}
          />
        )}
      </div>
    </div>
  );
}

StoryletRoot.displayName = "StoryletRoot";

export interface OwnProps {
  data: StoryletRootData;
  dispatch: Function; // eslint-disable-line
  rootEventId?: number | string | undefined;
  shareData?: any;
}

const mapStateToProps = (state: IAppState) => ({
  privilegeLevel: state.user.privilegeLevel,
  isChoosing: state.storylet.isChoosing,
  isGoingBack: state.storylet.isGoingBack,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(StoryletRoot);
