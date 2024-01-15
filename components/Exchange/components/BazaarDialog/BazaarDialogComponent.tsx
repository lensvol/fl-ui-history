import React, { useCallback, useState } from "react";

import ExchangeContext from "components/Exchange/ExchangeContext";
import ExchangeUI from "components/Exchange/components/ExchangeUI";
import TransactionComplete from "components/Exchange/components/BazaarDialog/TransactionComplete";
import Loading from "components/Loading";

export default function BazaarDialogComponent(props: Props) {
  const { isTransacting, onRequestClose } = props;

  const [transactionCompleteMessage, setTransactionCompleteMessage] = useState<
    string | undefined
  >();
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);

  const handleTransactionComplete = useCallback(
    (message: string, isSuccess: boolean) => {
      setTransactionCompleteMessage(message);
      setIsTransactionSuccess(isSuccess);
    },
    []
  );

  if (isTransacting) {
    return <Loading spinner />;
  }

  if (transactionCompleteMessage) {
    return (
      <TransactionComplete
        isTransactionSuccess={isTransactionSuccess}
        onRequestClose={onRequestClose}
        transactionCompleteMessage={transactionCompleteMessage}
      />
    );
  }

  return (
    <ExchangeContext.Consumer>
      {({ activeItem }) => (
        <ExchangeUI
          activeItem={activeItem}
          onRequestClose={onRequestClose}
          onTransactionComplete={handleTransactionComplete}
        />
      )}
    </ExchangeContext.Consumer>
  );
}

BazaarDialogComponent.displayName = "BazaarDialogComponent";

type Props = {
  isTransacting: boolean;
  onRequestClose: () => void;
  quantities: {
    [key: number]: number;
  };
};
