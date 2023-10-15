import React from "react";
import Buttonlet from "components/Buttonlet";
import { IContact } from "features/contacts";

type Props = {
  data: IContact;
  deleteContact: () => void;
};

export default function ContactItem({ data, deleteContact }: Props) {
  return (
    <li className="account__contact">
      <span>{data.userName}</span>
      <Buttonlet type="delete-contact" local onClick={deleteContact} />
    </li>
  );
}

ContactItem.displayName = "ContactItem";
