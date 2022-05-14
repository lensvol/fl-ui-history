import React from 'react';

import { CHANGEABLE_CATEGORIES } from 'constants/outfits';
import ProfileContext from 'components/Profile/ProfileContext';
import { OutfitSlotName } from 'types/outfit';
import { IQuality } from 'types/qualities';
import ProfileInventoryItemComponent from './ProfileInventoryItemComponent';

export default function ProfileInventoryItemContainer({ data }: { data: IQuality }) {
  const { category } = data;
  const isCategoryChangeable = CHANGEABLE_CATEGORIES.indexOf(category as OutfitSlotName) >= 0;
  return (
    <ProfileContext.Consumer>
      {({ editable, profileCharacter }) => (
        <ProfileInventoryItemComponent
          data={data}
          editable={editable && isCategoryChangeable}
          profileCharacter={profileCharacter}
        />
      )}
    </ProfileContext.Consumer>
  );
}

ProfileInventoryItemContainer.displayName = 'ProfileInventoryItemContainer';
