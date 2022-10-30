import React from "react";
import { ApiCharacterFriend } from "services/StoryletService";
import { IneligibleContact } from "types/storylet";
import { ActContextValue } from "./ActContext";
import IneligibleContacts from "./IneligibleContacts";

export default function SelectContact({
  eligibleFriends,
  ineligibleContacts,
  onSelectContact,
  selectedContactId,
}: SelectContactProps) {
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
          <EligibleContacts eligibleFriends={eligibleFriends} />
        </select>
      </label>
      <IneligibleContacts ineligibleContacts={ineligibleContacts} />
    </div>
  );
}

SelectContact.displayName = "SelectContactContainer";

type SelectContactProps = {
  eligibleFriends: ApiCharacterFriend[];
  ineligibleContacts: IneligibleContact[];
  onSelectContact: ActContextValue["onSelectContact"];
  selectedContactId?: number;
};

export function EligibleContacts({
  eligibleFriends,
}: {
  eligibleFriends: ApiCharacterFriend[];
}) {
  if (!eligibleFriends.length) {
    return (
      <>
        <option className="option--disabled-but-legible" value="-1" disabled>
          No eligible contacts
        </option>
      </>
    );
  }

  return (
    <>
      {eligibleFriends.map(({ id, name, userName }) => (
        <option key={id} value={id}>
          {`${name} (${userName})`}
        </option>
      ))}
    </>
  );
}
