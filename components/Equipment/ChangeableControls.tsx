import saveCurrentOutfit from "actions/outfit/saveCurrentOutfit";
import React, { useCallback, useMemo, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Feature } from "flagged";

import {
  FEATURE_DOES_STORYLET_STATE_LOCK_OUTFITS,
  NEW_OUTFIT_BEHAVIOUR,
} from "features/feature-flags";
import { Success } from "services/BaseMonadicService";
import { IOutfit } from "types/outfit";
import { IAppState } from "types/app";
import renameOutfit from "actions/outfit/renameOutfit";
import toggleFavouriteOutfit from "actions/outfit/toggleFavouriteOutfit";
import OutfitDropdown from "./OutfitDropdown";
import OutfitEditButtons from "./OutfitEditButtons";
import OutfitRenameForm from "./OutfitRenameForm";

export function ChangeableControls({
  dirty,
  isFavourite,
  outfits,
  onSaveOutfitSuccess,
  onSelectOutfit,
}: Props) {
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
    <Feature name={NEW_OUTFIT_BEHAVIOUR}>
      {(areOutfitsLockable: boolean) => (
        <>
          {isEditing && selectedOutfit ? (
            <OutfitRenameForm
              initialName={selectedOutfit.name}
              onSubmit={onSaveName}
              onCancel={onCancel}
            />
          ) : (
            <Feature name={FEATURE_DOES_STORYLET_STATE_LOCK_OUTFITS}>
              {(doesStoryletStateLockOutfits: boolean) => (
                <OutfitDropdown
                  areOutfitsLockable={areOutfitsLockable}
                  doesStoryletStateLockOutfits={doesStoryletStateLockOutfits}
                  onChange={onSelectOutfit}
                />
              )}
            </Feature>
          )}
          {isEditing ? null : (
            <OutfitEditButtons
              dirty={dirty}
              isFavourite={isFavourite}
              onStartEditing={onStartEditing}
              onSaveOutfit={onSaveOutfit}
              onToggleFavouriteOutfit={onToggleFavouriteOutfit}
            />
          )}
        </>
      )}
    </Feature>
  );
}

const mapStateToProps = (state: IAppState) => ({
  dirty: state.outfit.dirty,
  isFavourite: state.outfit.isFavourite,
  outfits: state.myself.character.outfits,
});

type OwnProps = {
  onSelectOutfit: (...args: any) => void;
  onSaveOutfitSuccess: (message?: string) => void;
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(ChangeableControls);
