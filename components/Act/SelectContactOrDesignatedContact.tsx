import React from "react";
import { ApiCharacterFriend } from "services/StoryletService";
import SelectContact from "./SelectContact";
import DesignatedContact from "./DesignatedContact";
import ActContext from "./ActContext";
import AddContact from "./AddContact";
import QualityRequirements from "./QualityRequirements";

export default function SelectContactOrDesignatedContact({
  designatedFriend,
  eligibleFriends,
  isFetchingIneligibleContacts,
}: Props) {
  if (designatedFriend) {
    return <DesignatedContact />;
  }

  if (isFetchingIneligibleContacts) {
    return null;
  }

  return (
    <ActContext.Consumer>
      {({
        ineligibleContacts,
        onAddContact,
        onSelectContact,
        selectedContactId,
      }) => (
        <>
          <h2 className="heading heading--2">Invite a contact</h2>
          <QualityRequirements />
          <div className="act__contact-choice-methods">
            <SelectContact
              eligibleFriends={eligibleFriends ?? []}
              ineligibleContacts={ineligibleContacts}
              onSelectContact={onSelectContact}
              selectedContactId={selectedContactId}
            />
            <AddContact onAddContact={onAddContact} />
          </div>
        </>
      )}
    </ActContext.Consumer>
  );
}

interface Props {
  designatedFriend: undefined | { name: string };
  eligibleFriends: ApiCharacterFriend[] | undefined;
  isFetchingIneligibleContacts: boolean;
}
