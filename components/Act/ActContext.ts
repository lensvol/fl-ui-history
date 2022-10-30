import { ChangeEvent, createContext } from "react";
import { IneligibleContact } from "types/storylet";

export type ActContextValue = {
  ineligibleContacts: IneligibleContact[];
  onSelectContact: (args: ChangeEvent<HTMLSelectElement>) => void;
  onAddContact: unknown;
  selectedContactId: number | undefined;
};

const ActContext = createContext<ActContextValue>({
  ineligibleContacts: [],
  onAddContact: undefined,
  onSelectContact: () => {
    /* no op */
  },
  selectedContactId: undefined,
});

ActContext.displayName = "ActContext";

export default ActContext;
