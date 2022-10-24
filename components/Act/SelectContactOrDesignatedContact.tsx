import QualityRequirements from "components/Act/components/QualityRequirements";
import React from "react";
import { ApiCharacterFriend } from "services/StoryletService";
import SelectContact from "./components/SelectContact";
import DesignatedContact from "./DesignatedContact";
import ActContext from "./ActContext";
import AddContact from "./components/AddContact";

export default function SelectContactOrDesignatedContact({
  designatedFriend,
  eligibleFriends,
}: Props) {
  if (designatedFriend) {
    return <DesignatedContact />;
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
}
