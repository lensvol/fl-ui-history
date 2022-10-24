import { createContext } from "react";

export type PurchaseFateContextValue = {
  onOpenPurchaseFateModal: () => void;
};

const PurchaseFateContext = createContext<PurchaseFateContextValue>({
  onOpenPurchaseFateModal: () => {
    console.warn(
      "PurchaseFateContext.onOpenPurchaseFateModal(): falling back to default"
    );
  },
});

PurchaseFateContext.displayName = "PurchaseFateContext";

export default PurchaseFateContext;
