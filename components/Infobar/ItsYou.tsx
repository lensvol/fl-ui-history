import React from 'react';

export default function ItsYou({ name }: { name: string }) {
  return (
    <span>
      It's
      {' '}
      <span dangerouslySetInnerHTML={{ __html: name }} />
      !
    </span>
  );
}
