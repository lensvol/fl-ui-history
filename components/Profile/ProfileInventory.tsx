import React, { useMemo } from "react";
import { useAppSelector } from "features/app/store";

import ProfileInventoryItem from "./ProfileInventoryItem";

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

    unsortedPossessions.forEach((p) => {
      dict[p.category] = p;
    });

    return dict;
  }, [standardEquipped, expandedEquipped]);

  return (
    <div className="profile__inventory">
      <div className="profile__inventory--top-row">
        <ProfileInventoryItem
          isLarge
          key={allPossessions["Clothing"]?.id}
          possession={allPossessions["Clothing"]}
        />
        <div className="profile__inventory--cluster">
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
          allPossessions["ConstantCompanion"],
        ].map((p) => (
          <ProfileInventoryItem isLarge key={p?.id} possession={p} />
        ))}
      </div>
      <div className="profile__inventory--bottom-row">
        <ProfileInventoryItem
          isLarge
          key={allPossessions["Destiny"]?.id}
          possession={allPossessions["Destiny"]}
        />
        <ProfileInventoryItem
          isLarge
          key={allPossessions["Affiliation"]?.id}
          possession={allPossessions["Affiliation"]}
        />
        <div className="profile__inventory--cluster">
          {[
            allPossessions["Transportation"],
            allPossessions["HomeComfort"],
            allPossessions["Ship"],
            allPossessions["Club"],
          ].map((p) => (
            <ProfileInventoryItem key={p?.id} possession={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
