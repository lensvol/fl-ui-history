import React, { Fragment, useMemo } from "react";
import { connect } from "react-redux";

import InventoryGroup from "components/Profile/components/ProfileInventoryGroups/InventoryGroup";
import { IAppState } from "types/app";
import { IQuality } from "types/qualities";
import sortInPossessionsTabOrder from "./sortInPossessionsTabOrder";

const withSortedPossessions = (
  group: { name: string; possessions: IQuality[] } | undefined
) => {
  if (group === undefined) {
    return undefined;
  }

  return {
    ...group,
    possessions: sortInPossessionsTabOrder(group.possessions),
  };
};

function ProfileInventoryGroups({ profile }: Props) {
  const { expandedEquipped, standardEquipped } = profile;

  const expandedWithSortedPossessions = useMemo(
    () => withSortedPossessions(expandedEquipped),
    [expandedEquipped]
  );
  const standardWithSortedPossessions = useMemo(
    () => withSortedPossessions(standardEquipped),
    [standardEquipped]
  );

  if (
    expandedWithSortedPossessions === undefined ||
    standardWithSortedPossessions === undefined
  ) {
    return null;
  }

  return (
    <Fragment>
      <div className="profile__inventory-group-container">
        <InventoryGroup
          data={standardWithSortedPossessions}
          hideHeadings
          overrideLevels
          profile
        />
      </div>
      <div className="profile__inventory-group-container">
        <InventoryGroup
          data={expandedWithSortedPossessions}
          hideHeadings
          overrideLevels
          profile
        />
      </div>
    </Fragment>
  );
}

ProfileInventoryGroups.displayName = "ProfileInventoryGroups";

const mapStateToProps = ({ profile }: IAppState) => ({
  profile,
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(ProfileInventoryGroups);
