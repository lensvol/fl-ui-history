import React, { useCallback, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

import renameOutfit from "actions/outfit/renameOutfit";
import saveCurrentOutfit from "actions/outfit/saveCurrentOutfit";
import toggleFavouriteOutfit from "actions/outfit/toggleFavouriteOutfit";

import OutfitDropdown from "components/Equipment/OutfitDropdown";
import OutfitEditButtons from "components/Equipment/OutfitEditButtons";
import OutfitRenameForm from "components/Equipment/OutfitRenameForm";

import { useAppSelector } from "features/app/store";

import { Success } from "services/BaseMonadicService";

import { IOutfit } from "types/outfit";

export default function ChangeableControls({
  onSaveOutfitSuccess,
  onSelectOutfit,
}: Props) {
  const dirty = useAppSelector((state) => state.outfit.dirty);
  const isFavourite = useAppSelector((state) => state.outfit.isFavourite);
  const outfits = useAppSelector((state) => state.myself.character.outfits);

  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);

  const selectedOutfit: IOutfit | undefined = useMemo(
    () => outfits.find((o) => o.selected),
    [outfits]
  );

  const onCancel = useCallback(() => setIsEditing(false), []);

  const onSaveName = useCallback(
    async ({ name }: { name: string }) => {
      if (selectedOutfit === undefined) {
        return;
      }

      await dispatch(renameOutfit(selectedOutfit.id, name));
      setIsEditing(false);
    },
    [dispatch, selectedOutfit]
  );

  const onSaveOutfit = useCallback(async () => {
    if (!dirty) {
      return;
    }

    const result = await dispatch(saveCurrentOutfit());

    if (!(result instanceof Success)) {
      return;
    }

    onSaveOutfitSuccess();
  }, [dirty, dispatch, onSaveOutfitSuccess]);

  const onToggleFavouriteOutfit = useCallback(async () => {
    const result = await dispatch(toggleFavouriteOutfit());

    if (!(result instanceof Success)) {
      return;
    }

    onSaveOutfitSuccess(
      isFavourite ? "Outfit unmarked favourite!" : "Outfit marked favourite!"
    );
  }, [dispatch, isFavourite, onSaveOutfitSuccess]);

  const onStartEditing = useCallback(() => setIsEditing(true), []);

  return (
    <>
      {isEditing && selectedOutfit ? (
        <OutfitRenameForm
          initialName={selectedOutfit.name}
          onSubmit={onSaveName}
          onCancel={onCancel}
        />
      ) : (
        <OutfitDropdown onChange={onSelectOutfit} />
      )}
      {!isEditing && (
        <OutfitEditButtons
          dirty={dirty}
          isFavourite={isFavourite}
          onStartEditing={onStartEditing}
          onSaveOutfit={onSaveOutfit}
          onToggleFavouriteOutfit={onToggleFavouriteOutfit}
        />
      )}
    </>
  );
}

ChangeableControls.displayName = "ChangeableControls";

type Props = {
  onSelectOutfit: (...args: any) => void;
  onSaveOutfitSuccess: (message?: string) => void;
};
