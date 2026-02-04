import React from "react";

type Props = {
  disabled: boolean;
  onClick: () => void;
};

export default function DiscardButton({ disabled, onClick }: Props) {
  return (
    <button
      className="button button--primary button--small card__discard-button"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      Discard
    </button>
  );
}

DiscardButton.displayName = "DiscardButton";
