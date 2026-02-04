import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

export default function UpdatesHeader() {
  const history = useHistory();

  const onGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <h1 className="heading heading--1 updates__navigation">
      <button
        className="button--link"
        onClick={onGoBack}
        style={{
          marginRight: "1rem",
        }}
        type="button"
      >
        <i className="fa fa-arrow-left back-button" />
      </button>
      Updates
    </h1>
  );
}

UpdatesHeader.displayName = "UpdatesHeader";
