import React, { CSSProperties, useMemo } from "react";
import classnames from "classnames";
import { ITooltipData } from "components/ModalTooltip/types";
import TippyWrapper from "components/TippyWrapper";
import {
  useButtonletClassName,
  useCircleClassName,
  useIconClassName,
} from "./hooks";
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
  spin?: boolean;
  style?: CSSProperties;
  title?: string;
  tooltipData?: ITooltipData;
  tooltipTimeout?: number;
  showModalTooltipOnTouch?: boolean;
  type: string;
};

export default function Buttonlet({
  classNames,
  disabled,
  focused,
  onClick,
  local,
  override,
  type,
  spin,
  style,
  title,
  tooltipData,
  showModalTooltipOnTouch,
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
        onClick={onClick}
        className={classnames("buttonlet-container", containerClassName)}
        type="button"
        disabled={disabled}
      >
        <span
          className={classnames(buttonletClassName, ` buttonlet-${type}`)}
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
          tooltipData={tooltipData}
          onClick={onClick}
          disabled={disabled}
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
