import React, { useMemo } from "react";
import { useAppSelector } from "features/app/store";

import ProfileInventoryItem from "./ProfileInventoryItem";

import { IQuality } from "types/qualities";
import categoryNameToHumanReadableCategoryName from "utils/categoryNameToHumanReadableCategoryName";

export default function ProfileInventory() {
  const standardEquipped = useAppSelector((s) => s.profile.standardEquipped);

  const allPossessions = useMemo(() => {
    const unsortedPossessions = [...(standardEquipped?.possessions ?? [])];

    const dict: { [x: string]: IQuality | undefined } = {};

    unsortedPossessions.forEach((p) => {
      dict[p.category] = p;
    });

    return dict;
  }, [standardEquipped]);

  var clothing = allPossessions["Clothing"];
  var hat = allPossessions["Hat"];
  var gloves = allPossessions["Gloves"];
  var weapon = allPossessions["Weapon"];
  var boots = allPossessions["Boots"];
  var companion = allPossessions["Companion"];
  var tott = allPossessions["ToolOfTheTrade"];
  var treasure = allPossessions["Treasure"];
  var spouse = allPossessions["ConstantCompanion"];
  var destiny = allPossessions["Destiny"];
  var affiliation = allPossessions["Affiliation"];
  var transportation = allPossessions["Transportation"];
  var homeComfort = allPossessions["HomeComfort"];
  var ship = allPossessions["Ship"];
  var club = allPossessions["Club"];

  var shouldShowMiddleRow =
    [tott, treasure, spouse].filter((p) => p).length > 0;

  var shouldShowBottomRow =
    [destiny, affiliation, transportation, homeComfort, ship, club].filter(
      (p) => p
    ).length > 0;

  return (
    <div className="profile__inventory">
      <div className="profile__inventory--top-row">
        <ProfileInventoryItem
          isLarge
          key={clothing?.id}
          possession={clothing}
          slotCategory="Clothing"
          slotDescription={
            "Items that conceal &ndash; or strategically display &ndash; your body. " +
            "They can be found at several Bazaar shops, and elsewhere."
          }
        />
        <div className="profile__inventory--cluster">
          <ProfileInventoryItem
            key={hat?.id}
            possession={hat}
            slotCategory="Hat"
            slotDescription={
              "A lid for your lid. Maywell&#8217;s Hattery can be found at the Bazaar; other hats are available elsewhere."
            }
          />
          <ProfileInventoryItem
            key={gloves?.id}
            possession={gloves}
            slotCategory="Gloves"
            slotDescription={
              "For protecting those precious fingers. Dark &amp; Savage sells them at the Bazaar; other gloves can be found elsewhere."
            }
          />
          <ProfileInventoryItem
            key={weapon?.id}
            possession={weapon}
            slotCategory="Weapon"
            slotDescription={
              "For confrontations physical or otherwise. " +
              "There are many sources of weapons, including Carrow&#8217;s Steel at the Bazaar."
            }
          />
          <ProfileInventoryItem
            key={boots?.id}
            possession={boots}
            slotCategory="Boots"
            slotDescription={
              "Watch who you&#8217;re stepping on, on your way to your desires. " +
              "Boots can be purchased from Mercury, on the Bazaar; but there are many other sources."
            }
          />
        </div>
        <ProfileInventoryItem
          isLarge
          key={companion?.id}
          possession={companion}
          slotCategory="Companion"
          slotDescription={
            "A friend, a pet, a hanger-on, a shadow. " +
            "Redemptions, on the Bazaar, offers the services of certain companions. Many others can be found elsewhere."
          }
        />
      </div>
      {shouldShowMiddleRow && (
        <div className="profile__inventory--middle-row">
          <ProfileInventoryItem
            isLarge
            key={tott?.id}
            possession={tott}
            slotCategory={categoryNameToHumanReadableCategoryName(
              "ToolOfTheTrade"
            )}
            slotDescription={
              "A specialised implement of a rarefied skill. Obtain one by acquiring an advanced Profession."
            }
          />
          <ProfileInventoryItem
            isLarge
            key={treasure?.id}
            possession={treasure}
            slotCategory="Treasure"
            slotDescription={
              "Something of immeasurable worth; a token of desire, love, avarice, victory, revenge. " +
              "Obtain one by completing your Ambition."
            }
          />
          <ProfileInventoryItem
            isLarge
            key={spouse?.id}
            possession={spouse}
            slotCategory="Spouse"
            slotDescription={
              "A special someone. Opportunities for romance and companionship abound in Fallen London; " +
              "a few might bear fruit in this way, especially once one is a Person of Some Importance."
            }
          />
        </div>
      )}
      {shouldShowBottomRow && (
        <div className="profile__inventory--bottom-row">
          <ProfileInventoryItem
            isLarge
            key={destiny?.id}
            possession={destiny}
            slotCategory="Destiny"
            slotDescription={
              "One day you will know. Destiny can be glimpsed at certain times of year &ndash; " +
              "the Feast of the Exceptional Rose, the Fruits of the Zee festival, Hallowmas, December. " +
              "The impatient might seek the Dilmun Club, and the Youthful Naturalist, and the thread that leads to Irem."
            }
          />
          <ProfileInventoryItem
            isLarge
            key={affiliation?.id}
            possession={affiliation}
            slotCategory="Affiliation"
            slotDescription={
              "An accolade, a title, or a group that counts you among their number. " +
              "Chances to gain Affiliations are varied, and tend to come during seasonal festivals " +
              "or after becoming a Person of Some Importance."
            }
          />
          <div className="profile__inventory--cluster">
            <ProfileInventoryItem
              key={transportation?.id}
              possession={transportation}
              slotCategory="Transportation"
              slotDescription={
                "A speedy escape, a luxurious tour, a team of horses to trample your enemies. " +
                "Chances to gain Transportation items are varied, and tend to come during seasonal " +
                "festivals or after becoming a Person of Some Importance."
              }
            />
            <ProfileInventoryItem
              key={homeComfort?.id}
              possession={homeComfort}
              slotCategory={categoryNameToHumanReadableCategoryName(
                "HomeComfort"
              )}
              slotDescription={
                "A beloved article of furniture, or a little something that looks lovely on the mantelpiece. " +
                "Chances to gain Home Comfort items are varied, and tend to come during seasonal festivals " +
                "or after becoming a Person of Some Importance."
              }
            />
            <ProfileInventoryItem
              key={ship?.id}
              possession={ship}
              slotCategory="Ship"
              slotDescription={
                "For traveling across the Unterzee. After becoming a Person of Some Importance, " +
                "obtaining a ship is possible in Wolfstack Docks."
              }
            />
            <ProfileInventoryItem
              key={club?.id}
              possession={club}
              slotCategory="Club"
              slotDescription={
                "There are four clubs in London that you may join. " +
                "After becoming a Person of Some Importance, chances to join them will begin to appear in the Opportunity Deck."
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
