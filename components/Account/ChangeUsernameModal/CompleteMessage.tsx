import React from "react";
import { useAppSelector } from "features/app/store";

type Props = {
  onRequestClose: () => void;
};

export default function CompleteMessage({ onRequestClose }: Props) {
  const name = useAppSelector((state) => state.settings.data.name);

  return (
    <div>
      <h2 className="media__heading heading heading--3">Success!</h2>
      <p>Your username is now {`'${name}'`}.</p>
      <div className="buttons" style={{ marginTop: ".5rem" }}>
        <button
          type="button"
          onClick={onRequestClose}
          className="button button--primary"
        >
          Close
        </button>
      </div>
    </div>
  );
}
