import React, { useMemo } from "react";
import { useAppSelector } from "features/app/store";

import ProfileInventoryItem from "./ProfileInventoryItem";
import { OUTFIT_CATEGORIES } from "constants/outfits";
import { IQuality } from "types/qualities";

export default function ProfileInventory() {
  const standardEquipped = useAppSelector((s) => s.profile.standardEquipped);
  const expandedEquipped = useAppSelector((s) => s.profile.expandedEquipped);

  const allPossessions = useMemo(() => {
    const unsortedPossessions = [
      ...(standardEquipped?.possessions ?? []),
      ...(expandedEquipped?.possessions ?? []),
    ];

    const dict: { [x: string]: IQuality | undefined } = {};

    OUTFIT_CATEGORIES.forEach((key) => {
      dict[key] = unsortedPossessions.find((p) => p.category === key);
    });

    return dict;
  }, [standardEquipped, expandedEquipped]);

  const bottomRowRawContents = [
    allPossessions["Destiny"],
    allPossessions["Affiliation"],
    allPossessions["Transportation"],
    allPossessions["HomeComfort"],
    allPossessions["Ship"],
    allPossessions["Club"],
  ];

  const bottomRowHasSixItems =
    bottomRowRawContents.filter((p) => p !== undefined).length === 6;
  const bottomRowClassName = bottomRowHasSixItems
    ? "profile__inventory--bottom-row-6"
    : "profile__inventory--bottom-row";

  const bottomRowFinalContents = [
    ...bottomRowRawContents.filter((p) => p !== undefined),
    undefined,
    undefined,
    undefined,
    undefined,
    undefined, // pad out to minimum length of 5
  ].slice(0, bottomRowHasSixItems ? 6 : 5);

  return (
    <div className="profile__inventory">
      <div className="profile__inventory--top-row">
        <ProfileInventoryItem
          isLarge
          key={allPossessions["Clothing"]?.id}
          possession={allPossessions["Clothing"]}
        />
        <div className="profile__inventory--top-center">
          {[
            allPossessions["Hat"],
            allPossessions["Gloves"],
            allPossessions["Weapon"],
            allPossessions["Boots"],
          ].map((p) => (
            <ProfileInventoryItem key={p?.id} possession={p} />
          ))}
        </div>
        <ProfileInventoryItem
          isLarge
          key={allPossessions["Companion"]?.id}
          possession={allPossessions["Companion"]}
        />
      </div>
      <div className="profile__inventory--middle-row">
        {[
          allPossessions["ToolOfTheTrade"],
          allPossessions["Treasure"],
          allPossessions["Spouse"],
        ].map((p) => (
          <ProfileInventoryItem isLarge key={p?.id} possession={p} />
        ))}
      </div>
      <div className={bottomRowClassName}>
        {bottomRowFinalContents.map((p) => (
          <ProfileInventoryItem key={p?.id} possession={p} />
        ))}
      </div>
    </div>
  );
}
