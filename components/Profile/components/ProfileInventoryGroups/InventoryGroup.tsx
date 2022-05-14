import React from 'react';
import classnames from 'classnames';

import InventoryItem from 'components/Profile/components/ProfileInventoryItem';
import { IQuality } from 'types/qualities';

type Props = {
  data: {
    name: string,
    possessions: IQuality[],
  },
  hideHeadings?: boolean,
  overrideLevels?: boolean,
  profile?: boolean,
};

export function InventoryGroup(props: Props) {
  const {
    data,
    hideHeadings,
    profile,
  } = props;

  const inventoryItems = [...data.possessions]
    .map(item => (
      <InventoryItem
        key={item.id}
        data={item}
        // overrideLevels={overrideLevels}
        // profile={profile}
      />
    ));

  if (!inventoryItems.length) {
    return null;
  }

  return (
    <div
      className={classnames('inventory-group', profile && 'inventory-group--profile')}
      data-group-name={data.name}
    >
      {!hideHeadings && <h2 className="heading heading--2 inventory-group__heading">{data.name}</h2>}
      <ul className={classnames(
        'items items--inline inventory-group__items',
        profile && 'inventory-group__items--profile',
      )}
      >
        {inventoryItems}
      </ul>
    </div>
  );
}

InventoryGroup.displayName = 'InventoryGroup';

export default InventoryGroup;