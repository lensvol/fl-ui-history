import React, { useCallback, useState } from "react";

import AddContactForm from "components/Contacts/components/AddContactForm";
import ContactList from "components/Contacts/components/ContactList";
import ContactsHeader from "components/Contacts/components/ContactsHeader";
import Loading from "components/Loading";
import SearchField from "components/SearchField";

import { useAppDispatch, useAppSelector } from "features/app/store";
import { addContact, deleteContact, IContact } from "features/contacts";

export default function Contacts() {
  const dispatch: Function = useAppDispatch();

  const contacts = useAppSelector((s) => s.contacts.contacts);
  const isFetching = useAppSelector((s) => s.contacts.isFetching);

  const [filterString, setFilterString] = useState("");
  const [addContactResponseMessage, setAddContactResponseMessage] =
    useState("");

  const handleAddContactFormSubmit = useCallback(
    async (values: { userName: string }) => {
      try {
        setAddContactResponseMessage("");

        const response = await dispatch(
          addContact({
            userName: values.userName,
          })
        ).unwrap();

        setAddContactResponseMessage(response.message);
      } catch (error) {
        const err: any = error;

        if (err.message) {
          console.error(err.message);

          setAddContactResponseMessage(err.message);
        }
      }
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    async (contact: IContact) => {
      try {
        await dispatch(
          deleteContact({
            userID: contact.id,
          })
        ).unwrap();
      } catch (error) {
        const err: any = error;

        if (err.message) {
          // NOTE: We should probably surface this error to the user
          console.error(err.message);
        }
      }
    },
    [dispatch]
  );

  const handleSearchFieldChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setFilterString(evt.currentTarget.value);
    },
    []
  );

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div>
      <ContactsHeader />

      <AddContactForm onSubmit={handleAddContactFormSubmit} />

      {addContactResponseMessage && (
        <p dangerouslySetInnerHTML={{ __html: addContactResponseMessage }} />
      )}

      <SearchField
        onChange={handleSearchFieldChange}
        placeholder="Search contacts"
        value={filterString}
      />

      <ContactList
        contacts={contacts}
        filterString={filterString}
        onDelete={handleDelete}
      />
    </div>
  );
}

Contacts.displayName = "Contacts";
