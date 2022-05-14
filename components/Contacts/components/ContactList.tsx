import React, { useCallback } from 'react';

import ContactItem from './ContactItem';

interface Props {
  children?: React.ReactNode,
  contacts?: any[],
  filterString: string,
  onDelete: (arg: any) => void,
}

export default function ContactList({
  children,
  contacts,
  filterString,
  onDelete,
}: Props) {
  const filterFn = useCallback(
    (c: any) => (!c.userName) || c.userName.toLowerCase().indexOf(filterString.toLowerCase()) >= 0,
    [filterString],
  );

  const visibleContacts = contacts?.filter(filterFn) ?? [];

  return (
    <ul
      className="account__contact-list"
      style={{ marginBottom: 40 }}
    >
      {visibleContacts
        .map(contact => (
          <ContactItem
            key={contact.id}
            data={contact}
            deleteContact={() => onDelete(contact)}
          />
        ))}
      {children}
    </ul>
  );
}

ContactList.displayName = 'ContactList';
