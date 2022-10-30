import React, { useCallback, useState } from "react";
import { IneligibleContact } from "types/storylet";

export default function IneligibleContacts({ ineligibleContacts }: Props) {
  const [showing, setShowing] = useState(false);

  const onClick = useCallback(() => setShowing(!showing), [showing]);

  return (
    <div className="act__ineligible-contacts">
      <p>
        <button
          className="ineligible-contacts__button"
          type="button"
          onClick={onClick}
          style={{ background: "transparent", border: "none" }}
        >
          <i className="fa fa-caret-right" />{" "}
          {`${showing ? "Hide" : "Show"} contacts I can't invite`}
        </button>
      </p>
      <div style={{ margin: "0 0 0 24px" }}>
        {showing && (
          <ul className="list--bulleted">
            {ineligibleContacts.map(
              ({ name, qualifies, correctInstance, youQualify }) => (
                <li key={name}>
                  {`${name} ${qualifies}${correctInstance}${youQualify}`}
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

IneligibleContacts.displayName = "IneligibleContacts";

type Props = {
  ineligibleContacts: IneligibleContact[];
};
