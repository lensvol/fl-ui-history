import buildMessagesObject from 'actions/app/processMessages/buildMessagesObject';
import React from 'react';
import classnames from 'classnames';

import QualityUpdatesList from 'components/QualityUpdates/QualityUpdatesList';
import QualityUpdate from 'components/QualityUpdates/QualityUpdate';
import {
  IMessages,
} from 'types/app/messages';

export default function QualityUpdates({ data }: { data: IMessages }) {
  const {
    difficultyMessages,
    headlineMessages,
    standardMessages,
    fateMessage,
    actionMessage,
    areaMessage,
    deckRefreshedMessage,
  } = buildMessagesObject(data);

  // Have we got messages?
  const hasMessages = [
    difficultyMessages,
    headlineMessages,
    standardMessages,
    fateMessage,
    actionMessage,
    areaMessage,
    deckRefreshedMessage,
  ].some(x => x && (!Array.isArray(x) || x.length));

  const WrapperClass = classnames({
    branch: hasMessages,
    'media--quality-updates': true,
  });

  return (
    <div className={WrapperClass}>
      {(difficultyMessages != null && difficultyMessages.length > 0) && (
        <QualityUpdatesList updates={difficultyMessages} />
      )}
      {(fateMessage != null) ? <QualityUpdate data={fateMessage} /> : null}
      {(actionMessage != null) ? <QualityUpdate data={actionMessage} /> : null}
      {(areaMessage != null) ? <QualityUpdate data={areaMessage} /> : null}
      {(deckRefreshedMessage != null) ? <QualityUpdate data={deckRefreshedMessage} /> : null}

      {(headlineMessages != null && headlineMessages.length > 0) && (
        <QualityUpdatesList updates={headlineMessages} />
      )}

      {(standardMessages != null && standardMessages.length > 0) && (
        <QualityUpdatesList updates={standardMessages} />
      )}
    </div>
  );
}

QualityUpdates.displayName = 'QualityUpdates';
