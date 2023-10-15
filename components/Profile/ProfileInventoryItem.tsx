import { equipQuality } from "actions/outfit";
import classnames from "classnames";
import Image from "components/Image";
import QualityPicker from "components/QualityPicker";
import { useAppDispatch, useAppSelector } from "features/app/store";
import { fetchProfile } from "features/profile";
import React, { Fragment, useCallback, useState } from "react";

import { useIsChangeable } from "components/Equipment/hooks";
import { OutfitSlotName } from "types/outfit";
import { IQuality } from "types/qualities";
import categoryNameToHumanReadableCategoryName from "utils/categoryNameToHumanReadableCategoryName";

export default function ProfileInventoryItem({
  possession,
}: {
  possession: IQuality;
}) {
  const { availableAt, category, description, id, image, name } = possession;

  const dispatch = useAppDispatch();

  const isCategoryChangeable = useIsChangeable(category as OutfitSlotName);
  const editable = useAppSelector(
    (s) => s.profile.isLoggedInUsersProfile && isCategoryChangeable
  );
  const profileName = useAppSelector((s) => s.profile.profileCharacter?.name);
  const qualityPickerQualities = useAppSelector((s) =>
    s.myself.qualities.filter((q) => q.category === category)
  );

  const [isChanging, setIsChanging] = useState(false);
  const [isQualityPickerOpen, setIsQualityPickerOpen] = useState(false);

  const handleChoose = useCallback(
    async (q: IQuality) => {
      if (profileName === undefined) {
        return;
      }

      setIsChanging(true);
      await dispatch(equipQuality(q.id, { autosaveOutfit: false }));
      await dispatch(fetchProfile({ characterName: profileName }));
      setIsChanging(false);
    },
    [dispatch, profileName]
  );

  const handleClick = useCallback(() => {
    if (!editable) {
      return;
    }
    setIsQualityPickerOpen(true);
  }, [editable]);

  const handleRequestClose = useCallback(() => {
    setIsQualityPickerOpen(false);
  }, []);

  const categoryName = categoryNameToHumanReadableCategoryName(category);

  const tooltipData = {
    ...possession,
    description: `
        <p>${description}</p>
        ${
          possession.availableAt
            ? `<p class="tooltip__available-at">${availableAt}</p>`
            : ""
        }
      `,
    level: undefined,
    levelDescription: undefined, // Don't let the tooltip override the quality name
  };

  return (
    <Fragment>
      <li
        data-quality-id={id}
        className={classnames(
          "profile__inventory-item",
          editable && "profile__inventory-item--editable",
          isChanging && "icon--is-loading"
        )}
      >
        <Image
          className="profile__inventory-item-image"
          icon={image}
          alt={name}
          type="small-icon"
          tooltipData={tooltipData}
          onClick={handleClick}
          defaultCursor={!editable}
        />
      </li>
      {editable && (
        <QualityPicker
          activateButtonLabel="Equip"
          header={`Equip your new ${categoryName}`}
          isOpen={isQualityPickerOpen}
          onChoose={handleChoose}
          onRequestClose={handleRequestClose}
          qualities={qualityPickerQualities}
        />
      )}
    </Fragment>
  );
}

ProfileInventoryItem.displayName = "ProfileInventoryItem";
