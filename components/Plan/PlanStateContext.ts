import { createContext } from "react";

export type PlanStateContextValue = {
  isSaving: boolean;
};

const PlanStateContext = createContext<PlanStateContextValue>({
  isSaving: false,
});

PlanStateContext.displayName = "PlanStateContext";

export default PlanStateContext;
