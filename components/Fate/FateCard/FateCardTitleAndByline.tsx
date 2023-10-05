import React from "react";
import classnames from "classnames";
import { FateCardReleaseDate } from "components/Fate/FateCard/index";
import { IFateCard } from "types/fate";

export default function FateCardTitleAndByline(
  props: Pick<IFateCard, "author" | "name" | "releaseDate" | "season"> & {
    story: boolean | undefined;
    forceBreaks?: boolean;
    noReleaseDate?: boolean;
    enhancedStore?: boolean;
  }
) {
  const { author, forceBreaks, name, noReleaseDate, story, enhancedStore } =
    props;

  return (
    <div
      className={classnames(
        "fate-card__title-and-byline",
        story && "fate-card__title-and-byline--story",
        enhancedStore && !forceBreaks && "enhanced-store--ribbon-spacer"
      )}
    >
      <h3
        className={classnames(
          "heading heading--3 fate-card__title",
          story && "fate-card__title--story",
          forceBreaks && "fate-card__title--force-breaks"
        )}
      >
        <span>{name}</span>
        {author && (
          <span style={{ fontFamily: "Roboto", fontWeight: "normal" }}>
            {" by " /* there's a non-breaking space in here */}
            {author.replace(" ", " ")}
          </span>
        )}
      </h3>
      {story && !(noReleaseDate ?? false) && <FateCardReleaseDate {...props} />}
    </div>
  );
}
