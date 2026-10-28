import React from "react";

import classnames from "classnames";

import buildMessagesObject from "actions/app/processMessages/buildMessagesObject";

import QualityUpdate from "components/QualityUpdates/QualityUpdate";
import QualityUpdatesList from "components/QualityUpdates/QualityUpdatesList";

import { IMessages } from "types/app/messages";

type Props = {
  data: IMessages;
};

export default function QualityUpdates({ data }: Props) {
  const {
    actionMessage,
    areaMessage,
    deckRefreshedMessage,
    difficultyMessages,
    fateMessage,
    headlineMessages,
    standardMessages,
  } = buildMessagesObject(data);

  // Have we got messages?
  const hasMessages = [
    actionMessage,
    areaMessage,
    deckRefreshedMessage,
    difficultyMessages,
    fateMessage,
    headlineMessages,
    standardMessages,
  ].some((qEffMsg) => qEffMsg && (!Array.isArray(qEffMsg) || qEffMsg.length));

  const WrapperClass = classnames({
    branch: hasMessages,
    "media--quality-updates": true,
  });

  return (
    <div className={WrapperClass}>
      {difficultyMessages != null && difficultyMessages.length > 0 && (
        <QualityUpdatesList updates={difficultyMessages} />
      )}

      {fateMessage != null ? <QualityUpdate data={fateMessage} /> : null}

      {actionMessage != null ? <QualityUpdate data={actionMessage} /> : null}

      {areaMessage != null ? <QualityUpdate data={areaMessage} /> : null}

      {deckRefreshedMessage != null ? (
        <QualityUpdate data={deckRefreshedMessage} />
      ) : null}

      {headlineMessages != null && headlineMessages.length > 0 && (
        <QualityUpdatesList updates={headlineMessages} />
      )}

      {standardMessages != null && standardMessages.length > 0 && (
        <QualityUpdatesList updates={standardMessages} />
      )}
    </div>
  );
}

QualityUpdates.displayName = "QualityUpdates";
