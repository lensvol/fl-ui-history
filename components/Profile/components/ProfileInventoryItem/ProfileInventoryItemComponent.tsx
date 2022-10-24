import React, { Fragment, useState, useCallback } from "react";
import { connect } from "react-redux";
import classnames from "classnames";

import { equipQuality } from "actions/outfit";
import { fetchProfile } from "actions/profile";
import Image from "components/Image";
import QualityPicker from "components/QualityPicker";
import categoryNameToHumanReadableCategoryName from "utils/categoryNameToHumanReadableCategoryName";

import getQualityPickerQualities from "selectors/profile/getQualityPickerQualitiesByCategory";
import { IAppState } from "types/app";
import { IQuality } from "types/qualities";
import { IProfileCharacter } from "types/profile";
import { ThunkDispatch } from "redux-thunk";

export function ProfileInventoryItemComponent(props: Props) {
  const {
    data,
    dispatch,
    editable,
    qualityPickerQualities,
    profileCharacter: { name: profileName },
  } = props;

  const [isChanging, setIsChanging] = useState(false);
  const [isQualityPickerOpen, setIsQualityPickerOpen] = useState(false);

  const handleChoose = useCallback(
    async ({ id }: { id: number }) => {
      setIsChanging(true);
      await dispatch(equipQuality(id, { autosaveOutfit: false }));
      await dispatch(fetchProfile(profileName));
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

  const { availableAt, category, description, id, image, name } = data;

  const categoryName = categoryNameToHumanReadableCategoryName(category);

  const tooltipData = {
    ...data,
    description: `
        <p>${description}</p>
        ${
          data.availableAt
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

ProfileInventoryItemComponent.displayName = "ProfileInventoryItemComponent";

const mapStateToProps = (state: IAppState, props: OwnProps) => ({
  qualityPickerQualities: getQualityPickerQualities(state, props),
});

interface OwnProps {
  data: IQuality;
  editable: boolean;
  profileCharacter: IProfileCharacter;
}

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> & {
    dispatch: ThunkDispatch<any, any, any>;
  };

export default connect(mapStateToProps)(ProfileInventoryItemComponent);
