import classnames from "classnames";
import Image from "components/Image";
import { buildTooltipData } from "components/SidebarQualities/utils";
import { useAppDispatch, useAppSelector } from "features/app/store";
import React, { Fragment, useCallback, useState } from "react";

import { chooseNewMantelpiece, chooseNewScrapbook } from "actions/myself";
import { fetchProfile } from "features/profile";

import QualityPicker from "components/QualityPicker";
import { IQuality } from "types/qualities";

const labelToQualityPickerHeader = (label: "Mantelpiece" | "Scrapbook") =>
  ({
    Mantelpiece: "Mantelpiece item",
    Scrapbook: "Scrapbook status",
  })[label];

interface OwnProps {
  quality: IQuality;
  label: "Mantelpiece" | "Scrapbook";
}

export default function DisplayItem(props: OwnProps) {
  const dispatch = useAppDispatch();

  const editable = useAppSelector((s) => s.profile.isLoggedInUsersProfile);
  const profileCharacter = useAppSelector((s) => s.profile.profileCharacter);

  const { quality, label } = props;

  const { category, nature } = quality;

  const qualityPickerQualities = useAppSelector((s) =>
    s.myself.qualities.filter((q) => q.category === category)
  );

  const [isQualityPickerOpen, setIsQualityPickerOpen] = useState(false);

  const handleChoose = useCallback(
    async (newQuality: IQuality) => {
      const action =
        nature === "Thing" ? chooseNewMantelpiece : chooseNewScrapbook;
      await dispatch(action(newQuality));
      if (profileCharacter) {
        dispatch(fetchProfile({ characterName: profileCharacter.name }));
      }
    },
    [dispatch, nature, profileCharacter]
  );

  const handleClick = useCallback(() => {
    setIsQualityPickerOpen(true);
  }, []);

  const handleRequestClose = useCallback(() => {
    setIsQualityPickerOpen(false);
  }, []);

  const tooltipData = buildTooltipData(quality);
  const { effectiveLevel, image, nameAndLevel } = quality;

  return (
    <Fragment>
      <div className="profile__display-item-container">
        <div
          className={classnames(
            "profile__display-item",
            editable && "profile__display-item--editable"
          )}
        >
          <Image
            className="profile__display-item-image"
            defaultCursor={!editable}
            icon={image}
            alt={nameAndLevel}
            type="icon"
            tooltipData={tooltipData}
            onClick={handleClick}
          />
          <span className="icon__value">{effectiveLevel}</span>
        </div>

        <div>
          <h3 className="heading heading--2">{label}</h3>
          <div className="item__desc">
            <span className="js-item-name item__name profile__display-item-description">
              {nameAndLevel}
            </span>
          </div>
        </div>
      </div>

      {editable && (
        <QualityPicker
          activateButtonLabel="Flaunt"
          header={`Choose your new ${labelToQualityPickerHeader(label)}`}
          isOpen={isQualityPickerOpen}
          onChoose={handleChoose}
          onRequestClose={handleRequestClose}
          qualities={qualityPickerQualities}
        />
      )}
    </Fragment>
  );
}

DisplayItem.displayName = "DisplayItem";
