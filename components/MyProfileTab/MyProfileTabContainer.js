import React from 'react';

import GeneralContainer from 'components/GeneralContainer';
import MyProfile from 'components/MyProfile';

export default function MyProfileTabContainer() {
  return (
    <GeneralContainer>
      <MyProfile />
    </GeneralContainer>
  );
}

MyProfileTabContainer.displayName = 'MyProfileTabContainer';
