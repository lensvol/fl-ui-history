import React, { useEffect, useMemo, useState } from "react";
import classnames from "classnames";

type Props = {
  after: number | undefined;
  before: number | undefined;
  category: string | undefined;
  end: number | undefined;
  start: number | undefined;
  type: "Pyramid" | "Target" | undefined;
};

type ProgressBarType = "Normal" | "Target" | "Menace";

export default function ProgressBar(props: Props) {
  const { after, before, category, end, start, type } = props;

  const [value, setValue] = useState(start);

  const progressBarType: ProgressBarType = useMemo(() => {
    if (category === "Menace") {
      return "Menace";
    }
    if (type === "Target") {
      return "Target";
    }
    return "Normal";
  }, [category, type]);

  const className = useMemo(() => {
    switch (progressBarType) {
      case "Menace":
        return "progress-bar--menace";
      case "Target":
        return "progress-bar--target";
      case "Normal":
      default:
        return undefined;
    }
  }, [progressBarType]);

  const stripeClassName = useMemo(() => {
    switch (progressBarType) {
      case "Menace":
        return "progress-bar__stripe--menace";
      case "Target":
        return "progress-bar__stripe--target";
      case "Normal":
      default:
        return undefined;
    }
  }, [progressBarType]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setValue(end);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [end]);

  // We need all of our optional properties to be defined
  if ([after, before, end, start].some((prop) => prop === undefined)) {
    return null;
  }

  return (
    <div className="progress">
      <div className="progress__current">{before}</div>
      <div className="progress__bar">
        <div
          className={classnames(
            "progress-bar progress-bar--light-background",
            className
          )}
        >
          <span
            className={classnames(
              "progress-bar__stripe",
              start !== end && "progress-bar__stripe--has-transition",
              stripeClassName
            )}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
      {after !== undefined && <div className="progress__current">{after}</div>}
    </div>
  );
}
