import React from "react";

import classnames from "classnames";

import MaybeSecondChance from "components/Branch/MaybeSecondChance";
import Image from "components/Image";

import { IChallenge } from "types/storylet";

export interface Props {
  data: IChallenge;
  isAgent: boolean;
  locked: boolean;
  toggleSecondChance: (_: boolean, __: number) => void;
}

export default function Challenge({
  data,
  isAgent,
  locked,
  toggleSecondChance,
}: Props) {
  const { baseDescription, bonuses, description, image, name, targetNumber } =
    data;

  const hasBonus = bonuses && bonuses.length;
  const challengeName = hasBonus
    ? [name, ...bonuses.map((b) => b.name)].join(" + ")
    : name;
  const quality = hasBonus ? "qualities" : "quality";
  const gives = hasBonus ? "give" : "gives";
  const you = isAgent ? "them" : "you";
  const your = isAgent ? "Your agent's" : "Your";
  const challengeDescription = `${your} ${challengeName} ${quality} ${gives} ${you} a ${targetNumber}% chance of success.`;

  return (
    <div className="challenge-and-second-chance">
      <div className={classnames("challenge", locked && "challenge--locked")}>
        <div className="challenge__left">
          <div className="js-icon icon icon--circular challenge__icon">
            <Image
              alt={name}
              defaultCursor
              icon={image}
              tooltipData={
                hasBonus
                  ? {
                      description: baseDescription,
                    }
                  : undefined
              }
              type="small-icon"
            />
          </div>
          {bonuses &&
            bonuses.map((b) => (
              <>
                <div className="js-icon icon icon--circular challenge__icon">
                  <Image
                    alt={b.name}
                    defaultCursor
                    icon={b.image}
                    style={{
                      marginLeft: "0.25rem",
                    }}
                    tooltipData={{
                      description: b.description,
                    }}
                    type="small-icon"
                  />
                </div>
              </>
            ))}
        </div>
        <div className="challenge__body">
          <h3
            className="media__heading heading heading--4 challenge__heading"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <p className="challenge__description">{challengeDescription}</p>
        </div>
      </div>
      {targetNumber > 0 && targetNumber < 100 && (
        <MaybeSecondChance
          data={data}
          locked={locked}
          toggleSecondChance={toggleSecondChance}
        />
      )}
    </div>
  );
}

Challenge.displayName = "Challenge";
