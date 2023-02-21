import React, { useCallback, useEffect, useState } from "react";
import { Feature } from "flagged";
import { FEATURE_IS_IT_ADVENT } from "features/feature-flags";
import {
  isDateDuringAdvent,
  INTERVAL_ADVENT_DATE_CHECK,
} from "components/Header/AdventLink";

export default function AdventLinkItem() {
  const [isItAdvent, setIsItAdvent] = useState(false);

  const runAdventCheck = useCallback(() => {
    setIsItAdvent(isDateDuringAdvent(new Date()));
  }, []);

  useEffect(() => {
    runAdventCheck();
    const interval = setInterval(runAdventCheck, INTERVAL_ADVENT_DATE_CHECK);
    return () => clearInterval(interval);
  }, [runAdventCheck]);

  if (!isItAdvent) {
    return null;
  }

  return (
    <Feature name={FEATURE_IS_IT_ADVENT}>
      <li className="sidemenu__nav-item">
        <a
          className="sidemenu__nav-link"
          href="https://advent.fallenlondon.com/"
          style={{ display: "flex" }}
        >
          <img
            alt="Mr Sacks"
            src="https://images.fallenlondon.com/icons/mistersackssmall.png"
            height="16"
            width="16"
            style={{
              marginRight: "5px",
            }}
          />
          It's Advent!
        </a>
      </li>
    </Feature>
  );
}
