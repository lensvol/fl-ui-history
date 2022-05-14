import React from 'react';
import classnames from 'classnames';
import Image from 'components/Image';
import MaybeSecondChance from 'components/Branch/MaybeSecondChance';
import { IChallenge } from "types/storylet";

export interface Props {
  data: IChallenge,
  locked: boolean,
  toggleSecondChance: (_: boolean, __: number) => void,
}

export default function Challenge({ data, locked, toggleSecondChance }: Props) {
  const {
    description,
    image,
    name,
    targetNumber,
  } = data;

  return (
    <div className="challenge-and-second-chance">
      <div className={classnames('challenge', locked && 'challenge--locked')}>
        <div className="challenge__left">
          <div className="js-icon icon icon--circular challenge__icon">
            <Image
              icon={image}
              alt={name}
              type="small-icon"
              defaultCursor
            />
          </div>
        </div>
        <div className="challenge__body">
          <h3 className="media__heading heading heading--4 challenge__heading" dangerouslySetInnerHTML={{ __html: description }} />
          <p className="challenge__description">
            {`Your ${name} quality gives you a ${targetNumber}% chance of success.`}
          </p>
        </div>
      </div>
      {targetNumber < 100 && <MaybeSecondChance data={data} locked={locked} toggleSecondChance={toggleSecondChance} />}
    </div>
  );
}

Challenge.displayName = 'Challenge';
