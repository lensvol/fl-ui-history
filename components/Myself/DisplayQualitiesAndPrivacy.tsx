import { setJournalPrivacy } from 'actions/myself';
import React, {
  ChangeEvent,
  useCallback,
} from 'react';
import { connect } from 'react-redux';

import PossibleDisplayQuality from './PossibleDisplayQuality';
import ProfileLink from './ProfileLink';
import { IAppState } from 'types/app';

type OwnProps = {
  // changeJournalPrivacy: (...args: any) => void,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & {
  dispatch: Function,
};

export function DisplayQualitiesAndPrivacy({
  dispatch,
  mantelpieceItemId,
  journalIsPrivate,
  scrapbookStatusId,
}: Props) {
  const onChangeJournalPrivacy = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    dispatch(setJournalPrivacy(checked));
  }, [dispatch]);

  return (
    <div className="myself-profile__panel">
      <div className="myself__display-qualities">
        <div className="myself__display-quality">
          <h3 className="heading heading--3">Mantelpiece</h3>
          <div className="display-quality__item">
            <PossibleDisplayQuality
              itemId={mantelpieceItemId}
              nature="Thing"
            />
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
        <ProfileLink />
        <label>
          <input
            name="hideProfile"
            type="checkbox"
            checked={journalIsPrivate}
            onChange={onChangeJournalPrivacy}
          />
          Private
          <div
            className="js-buttonlet-help buttonlet buttonlet--help fa-stack js-tt"
            title="Checking this will prevent you from appearing as a suggested contact for social actions"
            style={{ position: 'relative' }}
          >
            <i className="fa fa-circle fa-stack-2x" />
            <i className="fa fa-question fa-stack-1x fa-inverse" />
            <span className="u-visually-hidden">Help</span>
          </div>
        </label>
      </div>
    </div>
  );
}

const mapStateToProps = ({
  myself: {
    character: {
      journalIsPrivate,
      mantelpieceItemId,
      scrapbookStatusId,
    },
  },
}: IAppState) => ({
  journalIsPrivate,
  mantelpieceItemId,
  scrapbookStatusId,
});

export default connect(mapStateToProps)(DisplayQualitiesAndPrivacy);
