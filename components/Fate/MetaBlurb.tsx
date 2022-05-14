import { findFateCardMetaText } from 'components/Fate/utils';
import React from 'react';
import { IFateCard } from 'types/fate';

export default function MetaBlurb({ card }: { card: IFateCard | undefined }) {
  if (!card) {
    return null;
  }

  const { factions } = card;

  const preFactionListBlurb = findFateCardMetaText(card) ?? '';

  return (
    <div className="metablurb">
      <p
        className="metablurb__text"
        style={{ fontStyle: 'italic' }}
        dangerouslySetInnerHTML={{ __html: preFactionListBlurb }}
      />
      {factions && (
        <ul
          className="metablurb__faction-list"
          style={{ fontStyle: 'italic' }}
        >
          {factions
            .split(',')
            .map(_ => _.trim())
            .map(faction => (
              <li
                className="metablurb__faction-list-item"
                key={faction}
              >
                <span className="metablurb__faction-name">
                  {faction}
                </span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
