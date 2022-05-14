import React from 'react';

interface Props {
  amountString?: string | undefined,
}

export default function Header({ amountString }: Props) {
  return (
    <p style={{ padding: '8px 0' }}>
      Creating a subscription will automatically renew your Exceptional Friendship every month
      {' '}
      and charge
      {' '}
      {amountString ?? 'the amount chosen below'}
      {' '}
      to your chosen payment method.
    </p>
  );
}
