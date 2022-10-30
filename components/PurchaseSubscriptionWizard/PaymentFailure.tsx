import React from "react";

interface Props {
  message: string;
  onClick: () => void;
  onGoBack: () => void;
}

export default function PaymentFailure({ message, onClick, onGoBack }: Props) {
  return (
    <div>
      <h1 className="heading heading--3">Subscription failed</h1>
      <p>We weren't able to process your payment.</p>
      <p dangerouslySetInnerHTML={{ __html: message }} />
      <div className="buttons buttons--left buttons--no-squash buttons--space-between">
        <button
          className="button button--primary"
          onClick={onGoBack}
          type="button"
        >
          Go back
        </button>
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
