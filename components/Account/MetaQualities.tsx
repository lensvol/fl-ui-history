import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from 'types/app';
import MetaQuality from 'components/Account/MetaQuality';

export const MetaQualities = ({ qualitiesPossessedList }: Props) => {
  // Hide the whole section if we have no metaqualities to show
  if (!qualitiesPossessedList?.length) {
    return null;
  }

  return (
    <div>
      <h2 className="heading heading--2">Metaqualities</h2>
      <ul className="metaqualities__list">
        {qualitiesPossessedList && qualitiesPossessedList.map(quality => (
          <MetaQuality
            key={quality.id}
            data={quality}
          />
        ))}
      </ul>

    </div>
  );
};

const mapStateToProps = ({
  settings: { data: { qualitiesPossessedList } },
}: IAppState) => ({ qualitiesPossessedList });

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(MetaQualities);
