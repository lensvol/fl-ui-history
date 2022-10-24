import { IContact } from "types/contacts";

export default function addNewContactAndSort(
  contacts: IContact[],
  contact: IContact
) {
  return [...contacts, contact].sort((a, b) =>
    a.userName.toLowerCase().localeCompare(b.userName.toLowerCase())
  );
}
