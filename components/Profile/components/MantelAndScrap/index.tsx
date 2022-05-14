import DisplayItem from 'components/Profile/components/DisplayItem';
import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from 'types/app';

type Props = ReturnType<typeof mapStateToProps>;

export function MantelAndScrapContainer({ mantel, scrapbook }: Props) {
  return (
    <div className="profile__mantel-and-scrap">
      {mantel && <DisplayItem data={mantel} label="Mantelpiece" />}
      {scrapbook && <DisplayItem data={scrapbook} label="Scrapbook" />}
    </div>
  );
}

MantelAndScrapContainer.displayName = 'MantelAndScrapContainer';

const mapStateToProps = ({ profile: { profileCharacter } }: IAppState) => ({
  mantel: profileCharacter?.mantelpieceItem,
  scrapbook: profileCharacter?.scrapbookStatus,
});

export default connect(mapStateToProps)(MantelAndScrapContainer);