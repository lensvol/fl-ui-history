import React from "react";

import classnames from "classnames";

type Props = {
  isFirst: boolean;
  isLast: boolean;
  onShowNewer: () => void;
  onShowOlder: () => void;
};

export default function NewsNav({
  isFirst,
  isLast,
  onShowNewer,
  onShowOlder,
}: Props) {
  if (isFirst && isLast) {
    // only one news item; no arrows needed
    return null;
  }

  return (
    <div className="all-news-nav">
      <button
        className={classnames(
          "button--link",
          isFirst && "all-news-button-disabled"
        )}
        disabled={isFirst}
        onClick={onShowNewer}
        type="button"
      >
        <i
          className={classnames(
            "fa fa-arrow-left",
            isFirst ? "back-button-disabled" : "back-button"
          )}
        />
        <span className="u-visually-hidden">Newer</span>
      </button>

      <button
        className={classnames(
          "button--link",
          isLast && "all-news-button-disabled"
        )}
        disabled={isLast}
        onClick={onShowOlder}
        type="button"
      >
        <i
          className={classnames(
            "fa fa-arrow-right",
            isLast ? "back-button-disabled" : "back-button"
          )}
        />
        <span className="u-visually-hidden">Older</span>
      </button>
    </div>
  );
}

NewsNav.displayName = "NewsNav";
