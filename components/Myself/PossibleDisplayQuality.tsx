import React, { Fragment, useCallback, useState } from "react";
import { connect, useDispatch } from "react-redux";

import { chooseNewMantelpiece, chooseNewScrapbook } from "actions/myself";
import { IQuality } from "types/qualities";
import { IAppState } from "types/app";
import getQualities from "selectors/qualityPicker/getQualities";
import getItem from "selectors/myself/getItem";
import QualityPicker from "components/QualityPicker";
import EmptyDisplayQuality from "components/Myself/EmptyDisplayQuality";
import DisplayQuality from "./DisplayQuality";

export function PossibleDisplayQuality(props: Props) {
  const { item, nature, qualityPickerQualities } = props;

  const dispatch = useDispatch();

  const [isChanging, setIsChanging] = useState(false);
  const [isQualityPickerOpen, setIsQualityPickerOpen] = useState(false);

  const handleOpenQualityPicker = useCallback(() => {
    setIsQualityPickerOpen(true);
  }, []);

  const handleRequestClose = useCallback(() => {
    setIsQualityPickerOpen(false);
  }, []);

  const handleClick = useCallback(() => {
    handleOpenQualityPicker();
  }, [handleOpenQualityPicker]);

  const handleChoose = useCallback(
    async (newItem: IQuality) => {
      const action =
        nature === "Thing" ? chooseNewMantelpiece : chooseNewScrapbook;
      setIsChanging(true);
      await dispatch(action(newItem));
      setIsChanging(false);
    },
    [dispatch, nature]
  );

  return (
    <Fragment>
      {item ? (
        <DisplayQuality
          isChanging={isChanging}
          item={item}
          onClick={handleClick}
        />
      ) : (
        <EmptyDisplayQuality isChanging={isChanging} onClick={handleClick} />
      )}
      <QualityPicker
        activateButtonLabel="Flaunt"
        header={`Choose your new ${nature === "Thing" ? "Mantelpiece item" : "Scrapbook status"}`}
        isOpen={isQualityPickerOpen}
        onChoose={handleChoose}
        onRequestClose={handleRequestClose}
        qualities={qualityPickerQualities}
      />
    </Fragment>
  );
}

PossibleDisplayQuality.displayName = "PossibleDisplayQuality";

interface OwnProps {
  itemId: number | undefined;
  nature: string;
}

const mapStateToProps = (state: IAppState, props: OwnProps) => ({
  item: getItem(state, props),
  qualityPickerQualities: getQualities(state, props),
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(PossibleDisplayQuality);
