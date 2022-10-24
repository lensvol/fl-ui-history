import React from "react";

interface Props {
  message: string;
  onGoBack: () => void;
  onClose: () => void;
}

export default function PurchaseFateFailure({
  message,
  onClose,
  onGoBack,
}: Props) {
  return (
    <div>
      <p>
        Something went wrong and we weren't able to complete your transaction.
        Here's the message we received:
      </p>
      <p dangerouslySetInnerHTML={{ __html: message }} />
      <div className="buttons buttons--no-squash">
        <button
          className="button button--primary"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="button button--tertiary"
          type="button"
          onClick={onGoBack}
        >
          Go back
        </button>
      </div>
    </div>
  );
}
