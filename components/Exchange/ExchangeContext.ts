import { createContext } from "react";
import { IAvailability } from "types/exchange";

export type ExchangeContextValue = {
  activeItem: IAvailability | null;
  onStartTransaction: (availability: IAvailability) => void;
};

const ExchangeContext = createContext<ExchangeContextValue>({
  activeItem: null,
  onStartTransaction: (_) => {
    console.warn(
      "ExchangeContext.onStartTransaction() is falling back to default"
    );
  },
});
ExchangeContext.displayName = "ExchangeContext";

export default ExchangeContext;
