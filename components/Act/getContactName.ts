import { ApiCharacterFriend } from "services/StoryletService";

export default function getContactName({
  eligibleFriends,
  selectedContactId,
}: GetContactNameArgs): string {
  if (selectedContactId === undefined) {
    return "Your contact";
  }
  const friend = eligibleFriends.find(({ id }) => id === selectedContactId);
  if (friend) {
    return friend.name || "Your contact";
  }
  return "Your contact";
}

type GetContactNameArgs = {
  eligibleFriends: ApiCharacterFriend[];
  selectedContactId: number | undefined;
};
