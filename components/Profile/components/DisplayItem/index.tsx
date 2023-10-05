import React, { Fragment, useCallback, useState } from "react";
import { connect } from "react-redux";

import { chooseNewMantelpiece, chooseNewScrapbook } from "actions/myself";
import { fetchProfile } from "actions/profile";
import { ThunkDispatch } from "redux-thunk";
import getQualityPickerQualities from "selectors/profile/getQualityPickerQualitiesByNature";

import ProfileContext from "components/Profile/ProfileContext";
import QualityPicker from "components/QualityPicker";
import { IAppState } from "types/app";
import { IQuality } from "types/qualities";
import DisplayItemComponent from "./DisplayItemComponent";

const labelToQualityPickerHeader = (label: "Mantelpiece" | "Scrapbook") =>
  ({
    Mantelpiece: "Mantelpiece item",
    Scrapbook: "Scrapbook status",
  }[label]);

export function DisplayItem(props: Props) {
  const { data, dispatch, label, profileCharacter, qualityPickerQualities } =
    props;

  const { nature } = data;

  const [isQualityPickerOpen, setIsQualityPickerOpen] = useState(false);

  const handleChoose = useCallback(
    async (quality: IQuality) => {
      const action =
        nature === "Thing" ? chooseNewMantelpiece : chooseNewScrapbook;
      await dispatch(action(quality));
      if (profileCharacter) {
        dispatch(fetchProfile(profileCharacter.name));
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

  return (
    <ProfileContext.Consumer>
      {({ editable }) => (
        <Fragment>
          <DisplayItemComponent
            data={data}
            editable={editable}
            label={label}
            onClick={
              editable
                ? handleClick
                : () => {
                    // no-op
                  }
            }
          />
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
      )}
    </ProfileContext.Consumer>
  );
}

DisplayItem.displayName = "DisplayItem";

interface OwnProps {
  data: IQuality;
  label: "Mantelpiece" | "Scrapbook";
}

const mapStateToProps = (state: IAppState, props: OwnProps) => ({
  profileCharacter: state.profile.profileCharacter,
  qualityPickerQualities: getQualityPickerQualities(state, props),
});

interface Props extends OwnProps, ReturnType<typeof mapStateToProps> {
  dispatch: ThunkDispatch<any, any, any>;
}

export default connect(mapStateToProps)(DisplayItem);
