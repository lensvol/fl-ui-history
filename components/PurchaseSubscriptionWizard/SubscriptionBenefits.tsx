import React from "react";

interface Props {
  orientation: "horizontal" | "vertical";
}

export default function SubscriptionBenefits({ orientation }: Props) {
  const isHorizontal = orientation === "horizontal";
  const wrapperClassName = isHorizontal ? "ef-benefits" : "ef-subscribe";
  const allSubscribersClassName = isHorizontal
    ? "inner-tab--with-border"
    : "ef-all-subscriber-benefits";

  return (
    <div className={wrapperClassName}>
      <div className={allSubscribersClassName}>
        <h2>All Exceptional Friends receive:</h2>
        <ul>
          <li>A new Exceptional Story every month</li>
          <li>
            Memories of a Tale from each story to spend on exclusive companions
            and items
          </li>
          <li>A second candle (up to 40 actions at once)</li>
          <li>An expanded opportunity deck: ten cards instead of six</li>
          <li>Three additional outfit slots</li>
          <li>
            Access to the House of Chimes including monthly gameplay perks
          </li>
        </ul>
      </div>
      <div>
        <h2>
          <span className="enhanced-text">Enhanced</span> Exceptional Friends
          receive:
        </h2>
        <ul>
          <li>
            A past story, or two resets of stories they've played from a monthly
            menu
          </li>
          <li>Memories of a Tale from every past story or reset</li>
          <li>Extra monthly perks in the House of Chimes</li>
          <li>Three seven-action refreshes per month</li>
        </ul>
      </div>
    </div>
  );
}
