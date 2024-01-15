import React from "react";

import CloseButtonSmDown from "components/Exchange/components/CloseButtonSmDown";

type Props = {
  isTransactionSuccess: boolean;
  onRequestClose: () => void;
  transactionCompleteMessage?: string;
};

export default function TransactionComplete({
  isTransactionSuccess,
  onRequestClose,
  transactionCompleteMessage,
}: Props) {
  return (
    <div>
      <div className="exchange-ui__header">
        <h3
          className="heading heading--2"
          style={{
            color: "#000",
          }}
        >
          {isTransactionSuccess
            ? "Transaction complete!"
            : "Transaction failed!"}
        </h3>
        <CloseButtonSmDown onClick={onRequestClose} />
      </div>
      <hr />
      <div
        style={{
          textAlign: "center",
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: transactionCompleteMessage ?? "" }}
        />
      </div>
    </div>
  );
}

TransactionComplete.displayName = "TransactionComplete";
