import React from "react";

import CloseButtonSmDown from "../CloseButtonSmDown";

type Props = {
  onRequestClose: () => void;
  successMessage?: string | null;
};

export default function TransactionComplete({
  onRequestClose,
  successMessage,
}: Props) {
  return (
    <div>
      <div className="exchange-ui__header">
        <h3 className="heading heading--2" style={{ color: "#000" }}>
          Transaction complete!
        </h3>
        <CloseButtonSmDown onClick={onRequestClose} />
      </div>
      <hr />
      <div style={{ textAlign: "center" }}>
        <div dangerouslySetInnerHTML={{ __html: successMessage ?? "" }} />
      </div>
    </div>
  );
}

TransactionComplete.displayName = "TransactionComplete";
