import IneligibleContacts from "components/Act/components/IneligibleContacts";
import EligibleFriends from "components/Act/components/SelectContact/EligibleFriends";
import React from "react";

import { ApiCharacterFriend } from "services/StoryletService";
import { IneligibleContact } from "types/storylet";

export default function SelectContactContainer({
  eligibleFriends,
  ineligibleContacts,
  onSelectContact,
  selectedContactId,
}: Props) {
  return (
    <div className="act__contact-choice-method act__contact-choice-method--select-contact">
      <label
        className="act__contact-choice-label"
        htmlFor="js-targetCharacterId"
      >
        Select a contact:
        <select
          id="js-targetCharacterId"
          name="targetCharacterId"
          className="form__control form__control--no-border act__form-input"
          onChange={onSelectContact}
          value={selectedContactId}
        >
          <EligibleFriends eligibleFriends={eligibleFriends} />
        </select>
      </label>
      <IneligibleContacts ineligibleContacts={ineligibleContacts} />
    </div>
  );
}

SelectContactContainer.displayName = "SelectContactContainer";

type Props = {
  eligibleFriends: ApiCharacterFriend[];
  ineligibleContacts: IneligibleContact[];
  onSelectContact: (args?: any) => void;
  selectedContactId?: number;
};
