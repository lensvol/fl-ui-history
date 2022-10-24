import React from "react";

export default function ContactsHeader() {
  const buttonletText =
    "You can invite contacts to participate in stories with you." +
    " Add someone to your contacts list by entering their username." +
    " If they invite you to something, they'll be automatically added to your list.";

  return (
    <div
      style={
        {
          /* alignItems: 'center', display: 'flex ', marginBottom: '.5rem' */
        }
      }
    >
      <h2 className="heading heading--2 heading--no-margin-bottom">Contacts</h2>
      <p dangerouslySetInnerHTML={{ __html: buttonletText }} />
    </div>
  );
}

ContactsHeader.displayName = "ContactsHeader";
