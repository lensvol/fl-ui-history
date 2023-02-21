import React, { useCallback, useEffect, useState } from "react";

// Check whether it's Advent once a minute
export const INTERVAL_ADVENT_DATE_CHECK = 60 * 1000;

export function isDateDuringAdvent(date: Date) {
  // What's the date in London?
  const utcMonth = date.getUTCMonth();
  const utcDayOfMonth = date.getUTCDate();
  const utcHour = date.getUTCHours();

  // Outside December, we can be fairly certain it's not Advent
  if (utcMonth !== 11) {
    return false;
  }

  // It's Advent if it's later than 12.00 GMT on 1 Dec _and_ earlier than 12.00 on 30 Dec
  return (
    (utcDayOfMonth > 1 || utcHour >= 12) && (utcDayOfMonth < 29 || utcHour < 12)
  );
}

export default function AdventLink() {
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
    <div
      style={{
        alignItems: "center",
        display: "flex",
        marginLeft: "1rem",
      }}
    >
      <img
        src="https://images.fallenlondon.com/icons/mistersackssmall.png"
        height="18"
        alt="Mr Sacks"
        style={{
          marginRight: ".5rem",
        }}
      />
      <a href="//advent.fallenlondon.com"> It's Advent! </a>
    </div>
  );
}
