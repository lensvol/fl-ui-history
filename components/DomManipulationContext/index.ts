import React from "react";

export interface DomManipulationContextValue {
  onOpenSubscriptionModal: (arg?: any) => void;
}

const DomManipulationContext = React.createContext<DomManipulationContextValue>(
  {
    onOpenSubscriptionModal: () => {},
  }
);

DomManipulationContext.displayName = "DomManipulationContext";

export default DomManipulationContext;
