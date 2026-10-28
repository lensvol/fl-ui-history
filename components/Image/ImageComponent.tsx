import React, { SyntheticEvent, useCallback, useMemo } from "react";

import Interactive, { ClickType } from "react-interactive";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import { openModalTooltip } from "actions/modalTooltip";

import { ImageProps } from "components/Image/props";
import TippyWrapper from "components/TippyWrapper";

import getImagePath from "utils/getImagePath";

type Props = ImageProps;

export default function ImageComponent({
  alt,
  alwaysTriggerOnClick,
  className,
  defaultCursor,
  height,
  icon,
  interactiveProps = {},
  onClick,
  onLoad,
  style,
  tooltipData,
  type,
  width,
}: Props) {
  const noop = () => {
    /* do nothing */
  };

  const dispatch = useDispatch();

  // If we have tooltip data, we're wrapping the image in an Interactive that will handle clicks;
  // otherwise, we'll invoke the click handler directly from the img element itself.
  const imgElementOnClick = useMemo(() => {
    if (tooltipData) {
      return noop;
    }

    return onClick ?? noop;
  }, [onClick, tooltipData]);

  const showModal = useCallback(() => {
    if (tooltipData === undefined) {
      return;
    }

    const imagePath = getImagePath({
      icon,
      type,
    });

    dispatch(
      openModalTooltip({
        ...tooltipData,
        imagePath,
      })
    );
  }, [dispatch, icon, tooltipData, type]);

  const handleClick = useCallback(
    (evt: SyntheticEvent, clickType: ClickType) => {
      if (alwaysTriggerOnClick) {
        if (onClick) {
          return onClick(evt);
        }
      }

      // If we received a mouse click, then just run the 'onClick' handler that we were given
      if (clickType === "mouseClick") {
        if (onClick) {
          return onClick(evt);
        }
      }

      // Otherwise, this was a tap event (or similar) that requires us to show the info tooltip (with action buttons)
      return showModal();
    },
    [alwaysTriggerOnClick, onClick, showModal]
  );

  const img = useMemo(
    () => (
      <img
        alt={alt}
        aria-label={alt}
        className={classnames(defaultCursor && "cursor-default", className)}
        height={height}
        onClick={imgElementOnClick}
        onKeyUp={imgElementOnClick}
        onLoad={onLoad}
        src={getImagePath({
          icon,
          type,
        })}
        style={style}
        width={width}
      />
    ),
    [
      alt,
      className,
      defaultCursor,
      height,
      icon,
      imgElementOnClick,
      onLoad,
      style,
      type,
      width,
    ]
  );

  if (!tooltipData) {
    return img;
  }

  return (
    <Interactive
      as="div"
      aria-label={alt ?? ""}
      onClick={handleClick}
      style={{
        ...(defaultCursor ? { cursor: "default" } : {}),
      }}
      {...interactiveProps}
    >
      <TippyWrapper tooltipData={tooltipData}>{img}</TippyWrapper>
    </Interactive>
  );
}

ImageComponent.displayName = "ImageComponent";
