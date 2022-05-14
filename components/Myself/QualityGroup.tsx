import React, {
  useCallback,
} from 'react';
import { connect } from 'react-redux';
import Waypoint from 'react-waypoint';

import getVisibleQualities from 'selectors/myself/getVisibleQualities';
import { IAppState } from 'types/app';
import QualityItem from './QualityItem';

export function QualityGroup(props: Props) {
  const {
    filterString,
    id,
    name,
    onEnterWaypoint,
    qualities,
  } = props;

  const handleEnterWaypoint = useCallback(() => {
    onEnterWaypoint(id);
  }, [id, onEnterWaypoint]);

  if (!qualities.length) {
    return null;
  }

  return (
    <div
      className="quality-group"
      data-group-name={name}
    >
      <Waypoint onEnter={handleEnterWaypoint}>
        <h2 className="heading heading--2 quality-group__name">{name}</h2>
      </Waypoint>
      <ul
        id="filter-list-1"
        className="js-filter-list items items--list quality-group__items"
      >
        {qualities.map((q: any) => <QualityItem
          filterString={filterString}
          key={q.id} {...q} />)}
      </ul>
    </div>
  );
}

QualityGroup.displayName = 'QualityGroup';

type OwnProps = {
  filterString: string,
  id: number,
  name: string,
  onEnterWaypoint: (id: any) => void,
};

const mapStateToProps = (state: IAppState, props: OwnProps) => ({
  qualities: getVisibleQualities(state, props),
});

interface Props extends OwnProps, ReturnType<typeof mapStateToProps> {}

export default connect(mapStateToProps)(QualityGroup);
