import React from "react";

export interface IActionRefreshContextValues {
  onOpenActionRefreshModal: () => void;
  onOpenPurchaseFateModal: () => void;
}

const DEFAULT_VALUES: IActionRefreshContextValues = {
  onOpenActionRefreshModal: () => {
    console.warn(
      "ActionRefreshContext.onOpenActionRefreshModal is falling back to default"
    );
  },
  onOpenPurchaseFateModal: () => {
    console.warn(
      "ActionRefreshContext.onOpenPurchaseFateModal is falling back to default"
    );
  },
};

const ActionRefreshContext =
  React.createContext<IActionRefreshContextValues>(DEFAULT_VALUES);
ActionRefreshContext.displayName = "ActionRefreshContext";

ActionRefreshContext.displayName = "ActionRefreshContext";

export default ActionRefreshContext;
