import React from 'react';
import Buttonlet from 'components/Buttonlet';

export default function ContactItem({ data, deleteContact }: Props) {
  return (
    <li className="account__contact">
      <span>
        {data.userName}
      </span>
      <Buttonlet type="delete-contact" local onClick={deleteContact} />
    </li>
  );
}

ContactItem.displayName = 'ContactItem';

type Props = {
  data: any,
  deleteContact: () => void,
};
