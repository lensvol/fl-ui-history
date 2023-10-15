import React, { useCallback, useMemo, useState } from "react";
import { useFeature } from "flagged";

import Buttonlet from "components/Buttonlet";
import { NEW_OUTFIT_BEHAVIOUR } from "features/feature-flags";

type Props = {
  dirty: boolean;
  isFavourite: boolean;
  onStartEditing: () => void;
  onSaveOutfit: () => Promise<void>;
  onToggleFavouriteOutfit: () => Promise<void>;
};

export default function OutfitEditButtons({
  dirty,
  isFavourite,
  onSaveOutfit,
  onStartEditing,
  onToggleFavouriteOutfit,
}: Props) {
  const hasNewOutfitBehaviour = useFeature(NEW_OUTFIT_BEHAVIOUR);

  const [isSaving, setIsSaving] = useState(false);

  const onClickToSaveOutfit = useCallback(async () => {
    setIsSaving(true);
    await onSaveOutfit();
    setIsSaving(false);
  }, [onSaveOutfit]);

  const saveButtonDescription = useMemo(() => {
    if (!dirty) {
      return "You haven't made any changes to this outfit.";
    }
    return "Save your changes to this outfit.";
  }, [dirty]);

  const handleToggleFavourite = useCallback(async () => {
    setIsSaving(true);

    await onToggleFavouriteOutfit();

    setIsSaving(false);
  }, [onToggleFavouriteOutfit]);

  if (!hasNewOutfitBehaviour) {
    return null;
  }

  return (
    <>
      <Buttonlet
        type={isSaving ? "refresh" : isFavourite ? "star" : "star-o"}
        title={isFavourite ? "Unmark as favourite" : "Mark as favourite"}
        onClick={handleToggleFavourite}
        disabled={isSaving}
        spin={isSaving}
      />
      <Buttonlet
        type="edit"
        onClick={onStartEditing}
        tooltipData={{
          description: "Edit this outfit's name",
        }}
      />
      <Buttonlet
        type={isSaving ? "refresh" : "save-outfit"}
        onClick={onClickToSaveOutfit}
        tooltipData={{
          description: saveButtonDescription,
        }}
        disabled={isSaving || !dirty}
        spin={isSaving}
      />
    </>
  );
}
