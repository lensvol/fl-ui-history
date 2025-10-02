import React from "react";

import classnames from "classnames";

import Loading from "components/Loading";

interface Props {
  classNames?: {
    className?: string;
    faClassName?: string;
    innerClassName?: string;
  };
  isDisabled?: boolean;
  isFetching: boolean;
  label: string;
  onClick: () => void;
}

export default function NavigationButton({
  classNames,
  isDisabled,
  isFetching,
  label,
  onClick,
}: Props) {
  return (
    <button
      className={classnames(
        classNames?.className,
        (isDisabled || isFetching) && "journal-entries__control--disabled"
      )}
      disabled={isDisabled || isFetching}
      onClick={onClick}
      type="button"
    >
      <div
        className={classnames(
          classNames?.innerClassName,
          (isDisabled || isFetching) && "button--disabled"
        )}
      >
        {isFetching ? (
          <Loading spinner small />
        ) : (
          <i className={classnames("fa", classNames?.faClassName)} />
        )}
      </div>
      <span className="u-visually-hidden">{label}</span>
    </button>
  );
}

NavigationButton.displayName = "NavigationButton";
