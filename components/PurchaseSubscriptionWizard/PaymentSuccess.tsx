import React from "react";

interface Props {
  message: string;
  onClick: () => void;
  title: string;
}

export default function PaymentSuccess({ message, onClick, title }: Props) {
  return (
    <div>
      <h1 className="heading heading--3">{title}</h1>
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
