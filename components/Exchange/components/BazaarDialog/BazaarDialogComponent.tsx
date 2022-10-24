import React, { useCallback, useState } from "react";

import Loading from "components/Loading";

import ExchangeUI from "../ExchangeUI";
import TransactionComplete from "./TransactionComplete";
import ExchangeContext from "components/Exchange/ExchangeContext";

export default function BazaarDialogComponent(props: Props) {
  const { isTransacting, onRequestClose } = props;

  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const handleTransactionComplete = useCallback((message: string) => {
    setSuccessMessage(message);
  }, []);

  if (isTransacting) {
    return <Loading spinner />;
  }

  if (successMessage) {
    return (
      <TransactionComplete
        onRequestClose={onRequestClose}
        successMessage={successMessage}
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
  quantities: { [key: number]: number };
};
