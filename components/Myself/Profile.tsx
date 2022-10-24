import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import getCanChangeFaceForFree from "selectors/myself/getCanChangeFaceForFree";

import PurchaseFaceModal from "components/PurchaseFaceModal";
import { IAppState } from "types/app";
import CameoAndViewButton from "./CameoAndViewButton";
import DisplayQualitiesAndPrivacy from "./DisplayQualitiesAndPrivacy";
import Lodgings from "./Lodgings";

function Profile(props: Props) {
  const [isViewCameosModalOpen, setIsViewCameosOpen] = useState(false);

  const handleRequestClose = useCallback(() => setIsViewCameosOpen(false), []);

  const viewCameos = useCallback(() => setIsViewCameosOpen(true), []);

  return (
    <>
      <h2 className="heading heading--2 myself-profile__header">
        Cameo &amp; Lodgings
      </h2>

      <div className="myself-profile__cameo-and-lodgings">
        <CameoAndViewButton {...props} viewCameos={viewCameos} />
        <Lodgings />
      </div>

      <DisplayQualitiesAndPrivacy />

      <PurchaseFaceModal
        isOpen={isViewCameosModalOpen}
        onRequestClose={handleRequestClose}
      />
    </>
  );
}

const mapStateToProps = ({
  myself: {
    qualities,
    character: {
      avatarImage,
      journalIsPrivate,
      mantelpieceItemId,
      name,
      scrapbookStatusId,
    },
  },
}: IAppState) => ({
  avatarImage,
  canChangeFaceForFree: getCanChangeFaceForFree({ myself: { qualities } }),
  journalIsPrivate,
  mantelpieceItemId,
  name,
  scrapbookStatusId,
});

type Props = ReturnType<typeof mapStateToProps>;

export default withRouter(connect(mapStateToProps)(Profile));
