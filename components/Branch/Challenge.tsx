import React from "react";

import classnames from "classnames";

import Image from "components/Image";
import MaybeSecondChance from "components/Branch/MaybeSecondChance";

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
  const { description, baseDescription, image, name, targetNumber, bonuses } =
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
              icon={image}
              alt={name}
              type="small-icon"
              defaultCursor
              tooltipData={
                hasBonus
                  ? {
                      description: baseDescription,
                    }
                  : undefined
              }
            />
          </div>
          {bonuses &&
            bonuses.map((b) => (
              <>
                <div className="js-icon icon icon--circular challenge__icon">
                  <Image
                    icon={b.image}
                    alt={b.name}
                    type="small-icon"
                    defaultCursor
                    tooltipData={{
                      description: b.description,
                    }}
                    style={{
                      marginLeft: "0.25rem",
                    }}
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
      {targetNumber < 100 && (
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
