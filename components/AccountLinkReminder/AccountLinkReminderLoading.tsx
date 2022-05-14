import React from 'react';
import Loading from 'components/Loading';

export default function AccountLinkReminderLoading() {
  return (
    <div>
      <p>
        Just a moment while we check your account settings...
      </p>
      <Loading spinner />
    </div>
  );
}