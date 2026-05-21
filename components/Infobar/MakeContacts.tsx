import React from "react";

export default function MakeContacts() {
  return (
    <>
      <p className="heading heading--3 snippet__heading">Make Contacts</p>
      <p>
        The{" "}
        <a
          href={`https://discordapp.com/invite/59aNpKf`}
          rel="noopener noreferrer"
          target="_blank"
        >
          Fallen London Discord
        </a>{" "}
        is the best place to find other active players, alongside our{" "}
        <a
          href={`https://community.failbettergames.com/`}
          rel="noopener noreferrer"
          target="_blank"
        >
          forums
        </a>
        . There are also lots of active players in{" "}
        <a
          href={`https://www.reddit.com/r/fallenlondon/`}
          rel="noopener noreferrer"
          target="_blank"
        >
          r/fallenlondon
        </a>
        .
      </p>
    </>
  );
}

MakeContacts.displayName = "MakeContacts";
