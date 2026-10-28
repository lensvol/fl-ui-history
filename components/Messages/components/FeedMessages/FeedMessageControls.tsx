import React, { useCallback, useState } from "react";

import { useDispatch } from "react-redux";

import { Link } from "react-router-dom";

import classnames from "classnames";

import { fetchInteractions } from "actions/messages";

import MessagesService from "services/MessagesService";

import wait from "utils/wait";

export default function FeedMessageControls() {
  const dispatch = useDispatch();

  const [isWorking, setIsWorking] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (isWorking) {
      return;
    }

    setIsWorking(true);

    await dispatch(fetchInteractions(new MessagesService()));
    await wait(1500);

    setIsWorking(false);
  }, [dispatch, isWorking]);

  return (
    <div>
      <button
        className="button--link button--link-inverse"
        disabled={isWorking}
        onClick={handleRefresh}
        style={{
          cursor: isWorking ? "not-allowed" : "pointer",
          marginRight: "2rem",
        }}
        type="button"
      >
        <i className={classnames("fa fa-refresh", isWorking && "fa-spin")} />
      </button>

      <Link className="link--inverse" to="/account">
        <i className="fa fa-cog" />

        <span className="u-visually-hidden">Settings</span>
      </Link>
    </div>
  );
}

FeedMessageControls.displayName = "FeedMessageControls";
