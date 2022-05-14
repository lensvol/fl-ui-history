import React from 'react';

interface Props {
  message: string,
  onClick: () => void,
}

export default function PaymentSuccess({ message, onClick }: Props) {
  return (
    <div>
      <h1 className="heading heading--3">Subscription failed</h1>
      <p dangerouslySetInnerHTML={{ __html: message }} />
      <div className="buttons">
        <button
          className="button button--primary"
          onClick={onClick}
          type="button"
        >
          Close
        </button>
      </div>
    </div>
  );
}