import React, { Fragment, useCallback, useState } from "react";

import classnames from "classnames";

import { chooseNewMantelpiece, chooseNewScrapbook } from "actions/myself";

import Image from "components/Image";
import QualityPicker from "components/QualityPicker";
import { buildTooltipData } from "components/SidebarQualities/utils";

import { useAppDispatch, useAppSelector } from "features/app/store";
import { fetchProfile } from "features/profile";

import { IQuality } from "types/qualities";

import shouldRenderQualityName from "utils/shouldRenderQualityName";

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

  const { nature } = quality;

  const qualityPickerQualities = useAppSelector((s) =>
    s.myself.qualities.filter((q) => q.nature === nature)
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

  const tooltipData = {
    ...buildTooltipData(quality),
    smallButtons: [
      {
        label: "Change",
        action: handleClick,
      },
    ],
  };

  const { effectiveLevel, image, nameAndLevel, levelDescription } = quality;

  const shouldRenderNameAndLevel = shouldRenderQualityName(nameAndLevel);

  const levelDescriptionNoItalics = (levelDescription ?? "")
    .replaceAll("<i>", "")
    .replaceAll("</i>", "")
    .replaceAll("<em>", "")
    .replaceAll("</em>", "");

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
          <span className="icon__value">
            {effectiveLevel.toLocaleString("en-GB")}
          </span>
        </div>

        <div>
          <h3 className="heading heading--2">{label}</h3>
          <div className="item__desc">
            {quality.nature === "Thing" ? (
              <>
                <div className="js-item-name item__name profile__display-item-description">
                  {shouldRenderNameAndLevel ? (
                    <span dangerouslySetInnerHTML={{ __html: nameAndLevel }} />
                  ) : (
                    nameAndLevel
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="js-item-name item__name profile__display-item-description">
                  {shouldRenderNameAndLevel ? (
                    <span dangerouslySetInnerHTML={{ __html: quality.name }} />
                  ) : (
                    quality.name
                  )}
                </div>
                <div
                  className="js-item-name item__name profile__display-item-description"
                  style={{
                    fontStyle: "italic",
                  }}
                >
                  {levelDescriptionNoItalics}
                </div>
              </>
            )}
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
