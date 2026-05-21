import React, { useCallback, useMemo } from "react";

import mandrake from "assets/img/mandrake.jpg";
import motr from "assets/img/motr.jpg";
import ssea from "assets/img/ssea.jpg";
import sskies from "assets/img/sskies.jpg";

import MediaSmUp from "components/Responsive/MediaSmUp";
import MediaXsDown from "components/Responsive/MediaXsDown";

export enum GameIdentifier {
  Mandrake,
  MaskOfTheRose,
  SunlessSea,
  SunlessSkies,
}

type GamePlatform = "Windows" | "Apple" | "Linux";

type FBGame = {
  id: GameIdentifier;
  name: string;
  steamId: number;
  description: string;
  image: string;
  platforms: GamePlatform[];
};

const FBGames: FBGame[] = [
  {
    id: GameIdentifier.Mandrake,
    name: "Mandrake",
    steamId: 3710210,
    description:
      "You are the last of the Mandrakes, a sorcerous line of gardeners. " +
      "At long last, you’ve returned to your family’s abandoned home. " +
      "Make friends, tend your gardens, and put down roots. " +
      "Fish, gather and delve in the wilds. " +
      "Make a place for yourself, and uncover the mysteries your family left behind.",
    image: mandrake,
    platforms: ["Linux", "Windows"],
  },
  {
    id: GameIdentifier.MaskOfTheRose,
    name: "Mask of the Rose",
    steamId: 1769980,
    description:
      "A marvellous romance with a hint of murder, where every playthrough is different! " +
      "Seek love, friendship, or more... intimate encounters. " +
      "Help a murdered man find justice. " +
      "And watch out for the bats.",
    image: motr,
    platforms: ["Linux", "Apple", "Windows"],
  },
  {
    id: GameIdentifier.SunlessSea,
    name: "Sunless Sea",
    steamId: 304650,
    description:
      "LOSE YOUR MIND. EAT YOUR CREW. DIE. " +
      "Take the helm of your steamship and set sail for the unknown! " +
      "Sunless Sea is a game of discovery, loneliness and frequent death, " +
      "set in the award-winning Victorian Gothic universe of Fallen London.",
    image: ssea,
    platforms: ["Linux", "Apple", "Windows"],
  },
  {
    id: GameIdentifier.SunlessSkies,
    name: "Sunless Skies",
    steamId: 596970,
    description:
      "SAIL THE STARS. BETRAY YOUR QUEEN. MURDER A SUN. " +
      "Sunless Skies is a Gothic Horror roleplay game " +
      "with a focus on exploration and exquisite storytelling.",
    image: sskies,
    platforms: ["Linux", "Apple", "Windows"],
  },
];

type Props = {
  gameId: GameIdentifier;
};

export default function OtherGame({ gameId }: Props) {
  const theGame = FBGames.find((g) => g.id === gameId);

  const ctaVerb = useMemo(() => {
    const id = theGame ? theGame.id : undefined;

    if (id === GameIdentifier.Mandrake) {
      return "Wishlist";
    }

    return "Buy";
  }, [theGame]);

  const doPopUp = useCallback(async () => {
    const steamId = theGame ? theGame.steamId : "";
    const mobileUrl = `https://store.steampowered.com/app/${steamId}/`;
    const newWindow = window.open(mobileUrl, "_blank", "noopener,noreferrer");

    if (newWindow) {
      newWindow.opener = null;
    }
  }, [theGame]);

  if (!theGame) {
    return null;
  }

  return (
    <>
      <MediaSmUp>
        <iframe
          src={`https://store.steampowered.com/widget/${theGame.steamId}/`}
          title={theGame.name}
        />
      </MediaSmUp>
      <MediaXsDown>
        <div className="media other-game-widget">
          <div className="other-game-header">
            <img
              alt={theGame.name}
              aria-label={theGame.name}
              className="storylet__card"
              src={theGame.image}
            />
            <div className="other-game-platforms">
              {theGame.platforms.map((platform) => (
                <i
                  id={platform.toString()}
                  key={platform.toString()}
                  aria-label={platform.toString()}
                  className={`fa fa-${platform.toString().toLowerCase()}`}
                />
              ))}
            </div>
          </div>

          <div className="other-game-body">
            <h2 className="media__heading heading heading--2 media__object">
              {theGame.name}
            </h2>
            <p>{theGame.description}</p>

            <div className="buttons storylet__buttons">
              <button
                className="button other-game-button"
                onClick={doPopUp}
                disabled={false}
                type="button"
              >
                <span>{ctaVerb} on Steam</span>{" "}
                <i className="fa fa-steam-square" />
              </button>
            </div>
          </div>
        </div>
      </MediaXsDown>
    </>
  );
}

OtherGame.displayName = "OtherGame";
