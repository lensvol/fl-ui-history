import React from 'react';

import Buttonlet from 'components/Buttonlet';

export default function EditToggle({ isEditing, onClick }: { isEditing: boolean, onClick: () => void }) {
  return (
    <Buttonlet
      onClick={onClick}
      type={isEditing ? 'close' : 'edit'}
    />
  );
}
