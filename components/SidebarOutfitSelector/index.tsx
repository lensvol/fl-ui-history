import { FEATURE_DOES_STORYLET_STATE_LOCK_OUTFITS } from "features/feature-flags";
import React from "react";
import { useFeature } from "flagged";

import SidebarOutfitSelector from "./SidebarOutfitSelector";

function SidebarOutfitSelectorContainer(props: { responsive?: boolean }) {
  const doesStoryletStateLockOutfits = !!useFeature(
    FEATURE_DOES_STORYLET_STATE_LOCK_OUTFITS
  );

  return (
    <SidebarOutfitSelector
      {...props}
      doesStoryletStateLockOutfits={doesStoryletStateLockOutfits}
    />
  );
}

export default SidebarOutfitSelectorContainer;
