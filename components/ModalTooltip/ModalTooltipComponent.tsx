import WorldQualityDescription from "components/Tooltip/WorldQualityDescription";
import React from "react";
import { ITooltipData } from "components/ModalTooltip/types";
import EnhancementDescription from "components/Tooltip/EnhancementDescription";

export default function ModalTooltipComponent(props: ITooltipData) {
  // Destructure tooltipData
  const {
    alt,
    cap,
    disableTouchEvents,
    enhancements,
    name,
    description,
    level,
    image,
    needsWorldQualityDescription,
    secondaryDescription,
    smallButtons,
    imagePath,
    onRequestClose,
  } = props;

  return (
    <div
      className="tooltip--item-modal"
      style={{ touchAction: disableTouchEvents ? "none" : undefined }}
    >
      {image && (
        <div className="icon icon--circular tooltip__icon">
          <img alt={alt} src={imagePath} />
        </div>
      )}
      <div className={Image ? "tooltip__desc" : "tooltip__desc__noImage"}>
        <span
          className="item__name"
          dangerouslySetInnerHTML={{ __html: name ?? "" }}
        />{" "}
        <span className="item__value">
          {level}
          {cap !== undefined && ` / ${cap}`}
        </span>
        <p>
          <span dangerouslySetInnerHTML={{ __html: description ?? "" }} />
          {(enhancements?.length ?? 0) > 0 && (
            <EnhancementDescription enhancements={enhancements} />
          )}
        </p>
        <div
          className="tooltip__secondary-description"
          dangerouslySetInnerHTML={{ __html: secondaryDescription ?? "" }}
        />
        {needsWorldQualityDescription && <WorldQualityDescription />}
        {smallButtons && (
          <div className="tooltip__buttons">
            {smallButtons.map((item) => (
              <button
                type="button"
                className="button button--primary button--sm button--tooltip"
                key={item.label}
                onClick={() => {
                  // Call onRequestClose, if we received it
                  onRequestClose?.();
                  item.action();
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

ModalTooltipComponent.displayName = "ModalTooltipComponent";
