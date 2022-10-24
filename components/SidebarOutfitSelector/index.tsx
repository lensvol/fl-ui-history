import {
  FEATURE_DOES_STORYLET_STATE_LOCK_OUTFITS,
  NEW_OUTFIT_BEHAVIOUR,
} from "features/feature-flags";
import React from "react";
import { useFeature } from "flagged";

import SidebarOutfitSelector from "./SidebarOutfitSelector";

function SidebarOutfitSelectorContainer(props: { responsive?: boolean }) {
  const areOutfitsLockable = !!useFeature(NEW_OUTFIT_BEHAVIOUR);
  const doesStoryletStateLockOutfits = !!useFeature(
    FEATURE_DOES_STORYLET_STATE_LOCK_OUTFITS
  );
  return (
    <SidebarOutfitSelector
      {...props}
      areOutfitsLockable={areOutfitsLockable}
      doesStoryletStateLockOutfits={doesStoryletStateLockOutfits}
    />
  );
}

export default SidebarOutfitSelectorContainer;
