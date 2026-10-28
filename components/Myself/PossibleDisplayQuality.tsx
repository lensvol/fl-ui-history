import React, { useCallback, useState } from "react";

import { useDispatch } from "react-redux";

import { chooseNewMantelpiece, chooseNewScrapbook } from "actions/myself";

import DisplayQuality from "components/Myself/DisplayQuality";
import EmptyDisplayQuality from "components/Myself/EmptyDisplayQuality";
import QualityPicker from "components/QualityPicker";

import { useAppSelector } from "features/app/store";

import getItem from "selectors/myself/getItem";
import getQualities from "selectors/qualityPicker/getQualities";

import { IQuality } from "types/qualities";

type Props = {
  itemId?: number;
  nature: string;
};

export default function PossibleDisplayQuality(props: Props) {
  const { nature } = props;

  const item = useAppSelector((state) => getItem(state, props));
  const qualityPickerQualities = useAppSelector((state) =>
    getQualities(state, props)
  );

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
    <>
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
    </>
  );
}

PossibleDisplayQuality.displayName = "PossibleDisplayQuality";
