import { useAppDispatch, useAppSelector } from "features/app/store";
import React, { useCallback, useState } from "react";

import Loading from "components/Loading";
import SearchField from "components/SearchField";

import { IContact, addContact, deleteContact } from "features/contacts";
import AddContactForm from "./components/AddContactForm";
import ContactsHeader from "./components/ContactsHeader";
import ContactList from "./components/ContactList";

export default function Contacts() {
  const dispatch = useAppDispatch();

  const contacts = useAppSelector((s) => s.contacts.contacts);
  const isFetching = useAppSelector((s) => s.contacts.isFetching);
  // const message = useAppSelector(s => s.contacts.message);

  const [filterString, setFilterString] = useState("");
  const [addContactResponseMessage, setAddContactResponseMessage] =
    useState("");

  const handleAddContactFormSubmit = useCallback(
    async (values: { userName: string }) => {
      try {
        setAddContactResponseMessage("");
        const response = await dispatch(
          addContact({ userName: values.userName })
        ).unwrap();
        setAddContactResponseMessage(response.message);
      } catch (e) {
        if (e.message) {
          console.error(e.message);
          setAddContactResponseMessage(e.message);
        }
      }
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    async (contact: IContact) => {
      try {
        await dispatch(deleteContact({ userID: contact.id })).unwrap();
      } catch (ex) {
        if (ex.message) {
          // NOTE: We should probably surface this error to the user
          console.error(ex.message);
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
        placeholder="Search contacts"
        value={filterString}
        onChange={handleSearchFieldChange}
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
