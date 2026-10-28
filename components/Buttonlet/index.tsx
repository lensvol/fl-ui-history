import React, { CSSProperties, useMemo } from "react";

import classnames from "classnames";

import {
  useButtonletClassName,
  useCircleClassName,
  useIconClassName,
} from "components/Buttonlet/hooks";
import { ITooltipData } from "components/ModalTooltip/types";
import TippyWrapper from "components/TippyWrapper";
import TouchModalTooltip from "components/Tooltip/TouchModalTooltip";

type Props = {
  classNames?: {
    buttonletClassName?: string;
    containerClassName?: string;
    circleClassName?: string;
    iconClassName?: string;
  };
  disabled?: boolean;
  focused?: boolean;
  local?: boolean;
  onClick?: (...args: any) => any;
  override?: boolean;
  showModalTooltipOnTouch?: boolean;
  spin?: boolean;
  style?: CSSProperties;
  title?: string;
  tooltipData?: ITooltipData;
  type: string;
};

export default function Buttonlet({
  classNames,
  disabled,
  focused,
  local,
  onClick,
  override,
  showModalTooltipOnTouch,
  spin,
  style,
  title,
  tooltipData,
  type,
}: Props) {
  const buttonletClassName = useButtonletClassName(
    classNames?.buttonletClassName,
    disabled,
    focused,
    local,
    onClick,
    type
  );

  const containerClassName = classNames?.containerClassName;
  const circleClassName = useCircleClassName(
    classNames?.circleClassName,
    override
  );
  const iconClassName = useIconClassName(
    classNames?.iconClassName,
    override,
    spin,
    type
  );

  const component = useMemo(
    () => (
      <button
        aria-label={title}
        className={classnames("buttonlet-container", containerClassName)}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <span
          className={classnames(buttonletClassName, `buttonlet-${type}`)}
          style={style}
          title={title}
        >
          <span className={circleClassName} />
          <span className={iconClassName} />
          <span className="u-visually-hidden">{type}</span>
        </span>
      </button>
    ),
    [
      buttonletClassName,
      circleClassName,
      containerClassName,
      disabled,
      iconClassName,
      onClick,
      style,
      title,
      type,
    ]
  );

  if (tooltipData) {
    if (showModalTooltipOnTouch) {
      return (
        <TouchModalTooltip
          disabled={disabled}
          onClick={onClick}
          tooltipData={tooltipData}
        >
          {component}
        </TouchModalTooltip>
      );
    }

    return <TippyWrapper tooltipData={tooltipData}>{component}</TippyWrapper>;
  }

  return component;
}

Buttonlet.displayName = "Buttonlet";
