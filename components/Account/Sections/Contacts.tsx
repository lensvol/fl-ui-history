import React from 'react';
import Contacts from 'components/Contacts';

export default function ContactsSection() {
  return (
    <>
      <p>
        Receiving abusive messages via Fallen London? Report the troublemaker at
        {' '}
        <a href="mailto:abuse@failbettergames.com">abuse@failbettergames.com</a>
        .
      </p>
      <Contacts />
    </>
  );
}