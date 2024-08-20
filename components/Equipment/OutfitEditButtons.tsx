import React, { useCallback, useMemo, useState } from "react";

import Buttonlet from "components/Buttonlet";

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
  const [isSaving, setIsSaving] = useState(false);
  const [isFavouriting, setIsFavouriting] = useState(false);

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
    setIsFavouriting(true);

    await onToggleFavouriteOutfit();

    setIsFavouriting(false);
  }, [onToggleFavouriteOutfit]);

  return (
    <>
      <Buttonlet
        type={isFavouriting ? "refresh" : isFavourite ? "star" : "star-o"}
        onClick={handleToggleFavourite}
        disabled={isFavouriting}
        spin={isFavouriting}
        tooltipData={{
          description: isFavourite
            ? "Unmark as favourite"
            : "Mark as favourite",
        }}
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
