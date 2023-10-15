import React, { useMemo } from "react";
import { useAppSelector } from "features/app/store";
import { withSortedPossessions } from "./utils";
import ProfileInventoryItem from "./ProfileInventoryItem";

export default function ProfileInventory() {
  const standardEquipped = useAppSelector((s) => s.profile.standardEquipped);
  const expandedEquipped = useAppSelector((s) => s.profile.expandedEquipped);

  const standardWithSortedPossessions = useMemo(
    () => withSortedPossessions(standardEquipped),
    [standardEquipped]
  );
  const expandedWithSortedPossessions = useMemo(
    () => withSortedPossessions(expandedEquipped),
    [expandedEquipped]
  );

  const allPossessions = useMemo(
    () => [
      ...(standardWithSortedPossessions?.possessions ?? []),
      ...(expandedWithSortedPossessions?.possessions ?? []),
    ],
    [expandedWithSortedPossessions, standardWithSortedPossessions]
  );

  return (
    <ul className="profile__inventory">
      {allPossessions.map((p) => (
        <ProfileInventoryItem possession={p} key={p.id} />
      ))}
    </ul>
  );
}
