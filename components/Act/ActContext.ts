import { ChangeEvent, createContext } from "react";

import { IEligibleFriend, IneligibleContact } from "types/storylet";

export type ActContextValue = {
  ineligibleContacts: IneligibleContact[];
  onAddContact?: (payload: {
    addedFriendId: number;
    eligibleFriends: IEligibleFriend[];
  }) => Promise<void>;
  onSelectContact: (args: ChangeEvent<HTMLSelectElement>) => void;
  selectedContactId?: number;
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
