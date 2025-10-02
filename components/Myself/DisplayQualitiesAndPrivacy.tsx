import React from "react";

import JournalPrivacy from "components/Myself/JournalPrivacy";
import OpenJournal from "components/Myself/OpenJournal";
import PossibleDisplayQuality from "components/Myself/PossibleDisplayQuality";
import ProfileLink from "components/Myself/ProfileLink";

import { useAppSelector } from "features/app/store";

export default function DisplayQualitiesAndPrivacy() {
  const mantelpieceItemId = useAppSelector(
    (state) => state.myself.character.mantelpieceItemId
  );
  const scrapbookStatusId = useAppSelector(
    (state) => state.myself.character.scrapbookStatusId
  );

  return (
    <div className="myself-profile__panel">
      <div className="myself__display-qualities">
        <div className="myself__display-quality">
          <h3 className="heading heading--3">Mantelpiece</h3>
          <div className="display-quality__item">
            <PossibleDisplayQuality itemId={mantelpieceItemId} nature="Thing" />
          </div>
        </div>
        <div className="myself__display-quality">
          <h3 className="heading heading--3">Scrapbook</h3>
          <div className="display-quality__item">
            <PossibleDisplayQuality
              itemId={scrapbookStatusId}
              nature="Status"
            />
          </div>
        </div>
      </div>
      <div className="myself-profile__view-and-set-private">
        <JournalPrivacy />
        <div>
          <OpenJournal /> <ProfileLink />
        </div>
      </div>
    </div>
  );
}

DisplayQualitiesAndPrivacy.displayName = "DisplayQualitiesAndPrivacy";
