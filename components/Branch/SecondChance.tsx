import React, { ChangeEvent, useCallback } from "react";
import { connect, DispatchProp } from "react-redux";
import classnames from "classnames";

import Image from "components/Image";
import { IChallenge } from "types/storylet";

const SECOND_CHANCE_ICONS = {
  Dangerous: "fist",
  Persuasive: "confidentsmile",
  Shadowy: "blackglove",
  Watchful: "eye",
};

export interface OwnProps {
  data: IChallenge;
  locked: boolean;
  toggleSecondChance: (checked: boolean, id: number) => void;
}

type Props = OwnProps & DispatchProp;

function SecondChance({ data, locked, toggleSecondChance }: Props) {
  const {
    id,
    name,
    secondChanceDescription,
    secondChanceId,
    secondChanceLevel,
  } = data;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      toggleSecondChance(e.target.checked, secondChanceId);
    },
    [secondChanceId, toggleSecondChance]
  );

  return (
    <div
      className={classnames("second-chance", locked && "second-chance--locked")}
    >
      <div className="second-chance__left">
        <div className="icon second-chance__icon">
          <Image icon={SECOND_CHANCE_ICONS[name]} type="small-icon" />
          <div className="icon__value">{secondChanceLevel}</div>
        </div>
      </div>
      <div className="second-chance__body">
        <label htmlFor={`js-second-chance-${id}`}>
          <input
            className="second-chance__checkbox"
            id={`js-second-chance-${id}`}
            name="secondChances"
            type="checkbox"
            onChange={handleChange}
          />
          <span dangerouslySetInnerHTML={{ __html: secondChanceDescription }} />
        </label>
      </div>
    </div>
  );
}
SecondChance.displayName = "SecondChance";

export default connect()(SecondChance);
