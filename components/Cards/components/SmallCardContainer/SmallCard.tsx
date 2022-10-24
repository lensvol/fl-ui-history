import classnames from "classnames";
import Image from "components/Image";
import { ITooltipData } from "components/ModalTooltip/types";
import TippyWrapper from "components/TippyWrapper";
import React from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import { ICard } from "types/cards";

import getBorderColour from "utils/getBorderColour";

type OwnProps = {
  cardData: ICard;
  tooltipData: ITooltipData;
};

const mapStateToProps = ({ cards: { isFetching } }: IAppState) => ({
  isFetching,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

function SmallCard({ cardData, isFetching, tooltipData }: Props) {
  const borderColour = getBorderColour(cardData);

  return (
    <TippyWrapper tooltipData={tooltipData}>
      <div
        className={classnames(
          "card storylet__card",
          isFetching && "card--fetching"
        )}
      >
        <Image
          borderContainerClassName="small-card__border"
          className="small-card__image"
          icon={cardData.image}
          alt={cardData.name}
          border={borderColour}
          tooltipData={tooltipData}
          type="icon"
          interactiveProps={{
            focus: {
              outline: "solid 2px #1d1d1d",
            },
          }}
        />
      </div>
    </TippyWrapper>
  );
}

SmallCard.displayName = "SmallCard";

export default connect(mapStateToProps)(SmallCard);
