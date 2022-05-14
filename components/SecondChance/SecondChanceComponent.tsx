import React from 'react';

import Branch from 'components/Branch';
import QualityUpdates from 'components/QualityUpdates';
import { IMessages } from 'types/app/messages';

type Props = {
  messages: IMessages | undefined,
  onChooseBranch?: any,
  onGoBack: any,
  secondChance: any,
  storylet: any,
};

export default function SecondChanceComponent({
  messages,
  onChooseBranch,
  onGoBack,
  secondChance,
  storylet,
}: Props) {
  return (
    <div>
      {messages !== undefined && <QualityUpdates data={messages} />}
      <Branch
        branch={secondChance.branch}
        onChooseBranch={onChooseBranch}
      />
      <div className="buttons buttons--left buttons--storylet-exit-options">
        {(storylet && storylet.canGoBack) && (
          <button
            type="button"
            className="button button--primary"
            onClick={onGoBack}
          >
            <i className="fa fa-arrow-left" />
            {' '}
            Perhaps not
          </button>
        )}
      </div>
    </div>
  );
}
