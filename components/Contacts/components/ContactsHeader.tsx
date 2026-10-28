import React from "react";

export default function ContactsHeader() {
  return (
    <div>
      <h2 className="heading heading--2 heading--no-margin-bottom">Contacts</h2>

      <p>
        You can invite contacts to participate in stories with you. Add someone
        to your contacts list by entering their username. If they invite you to
        something, they&rsquo;ll be automatically added to your list.
      </p>
    </div>
  );
}

ContactsHeader.displayName = "ContactsHeader";
