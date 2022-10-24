import React, { useMemo } from "react";

interface Props {
  isSuccess: boolean;
  message: string | undefined;
  onClickWhenFailed: () => void;
  onClickWhenSuccessful: () => void;
}

export default function CompleteMessage({
  isSuccess,
  message,
  onClickWhenFailed,
  onClickWhenSuccessful,
}: Props) {
  const header = useMemo(
    () => (
      <h2 className="heading heading--2">
        {isSuccess ? (
          <span> Success! </span>
        ) : (
          <span> Something went wrong </span>
        )}
      </h2>
    ),
    [isSuccess]
  );

  const messageParagraph = useMemo(() => {
    if (message) {
      return <p>{message}</p>;
    }
    if (isSuccess) {
      return <p>Your password was reset.</p>;
    }
    return <p>Something went wrong. Please try again.</p>;
  }, [isSuccess, message]);

  const buttons = useMemo(() => {
    if (isSuccess) {
      return (
        <div className="buttons">
          <button
            className="button button--primary"
            type="button"
            onClick={onClickWhenSuccessful}
          >
            Continue
          </button>
        </div>
      );
    }

    return (
      <div className="buttons">
        <button
          className="button button--primary"
          type="button"
          onClick={onClickWhenFailed}
        >
          Continue
        </button>
      </div>
    );
  }, [isSuccess, onClickWhenFailed, onClickWhenSuccessful]);

  return (
    <div>
      {header}
      {messageParagraph}
      {buttons}
    </div>
  );
}
