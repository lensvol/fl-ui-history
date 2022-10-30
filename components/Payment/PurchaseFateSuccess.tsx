import React from "react";

interface Props {
  message: string | undefined;
  onClick: () => void;
}

export default function PurchaseFateSuccess({ message, onClick }: Props) {
  return (
    <div>
      <h2 className="heading heading--3">Payment received</h2>
      <p className="heading--3">{message || "Success!"}</p>
      <p>
        Thanks for supporting the game! Your Fate is now available in your
        account. If you have any problems or concerns, do please contact{" "}
        <a
          href="mailto:purchases@failbettergames.com"
          target="_blank"
          className="link--inverse"
          rel="noopener noreferrer"
        >
          purchases@failbettergames.com
        </a>
        .
      </p>
      <div className="buttons">
        <button
          className="button button--primary"
          type="button"
          onClick={onClick}
        >
          Close
        </button>
      </div>
    </div>
  );
}

PurchaseFateSuccess.displayName = "PurchaseFateSuccess";
