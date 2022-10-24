import React from "react";
import { ApiCharacterFriend } from "services/StoryletService";

export default function EligibleContacts({ eligibleFriends }: Props) {
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

type Props = {
  eligibleFriends: ApiCharacterFriend[];
};
