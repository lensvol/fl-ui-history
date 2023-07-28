import React, { useCallback, useEffect, useRef, useState } from "react";
import TippyWrapper from "components/TippyWrapper";
import { ITooltipData } from "components/ModalTooltip/types";
import { TippyProps } from "@tippyjs/react";
import { ModalTooltip } from "components/ModalTooltip/ModalTooltipContainer";

// px movement before we treat this as a drag
const DRAG_THRESHOLD = 10;

// A modal tooltip that only responds to touch events
export default function TouchModalTooltip({
  children,
  tooltipData,
  disabled,
  onClick,
}: Props) {
  const isMouseDragging = useRef(false);
  const isMouseDown = useRef(false);
  const isTouchActive = useRef(false);
  const isTouchDragging = useRef(false);

  const [, setIsSelected] = useState(false);

  const dragStartX = useRef(0);
  const dragStartY = useRef(0);

  const ref = useRef<HTMLDivElement>(null);

  const [isModalTooltipOpen, setIsModalTooltipOpen] = useState(false);
  const [, setTooltipData] = useState({});

  const openModalTooltip = useCallback((newTooltipData: ITooltipData) => {
    setIsModalTooltipOpen(true);
    setTooltipData(newTooltipData);
  }, []);

  const onRequestClose = useCallback(() => {
    setIsModalTooltipOpen(false);
    setTooltipData({});
  }, []);

  const doOnClick = useCallback(
    (e) => {
      // Mouse is no longer down
      isMouseDown.current = false;

      // If we have dragged while the mouse was down, then don't trigger a click either
      if (isMouseDragging.current) {
        return;
      }

      // This isn't a real click event --- it's a simulated one from Leaflet
      // eslint-disable-next-line no-underscore-dangle
      if (e._simulated) {
        return;
      }

      // If we don't have an onclick callback, then return early
      if (!onClick) {
        return;
      }

      // If this was a mouse click (not a tap event), then actually run the onClick callback!
      if (!isTouchActive.current) {
        onClick(e);
      }
    },
    [isMouseDragging, isTouchActive, onClick]
  );

  const doOnMouseMove = useCallback(
    (e: MouseEvent) => {
      // Ignore mousemove events when we're not dragging
      if (!isMouseDown.current) {
        return;
      }

      // Check whether we've moved far enough to be considered "dragging"
      const { clientX, clientY } = e;

      isMouseDragging.current =
        isMouseDragging.current ||
        Math.abs(clientX - dragStartX.current) > DRAG_THRESHOLD ||
        Math.abs(clientY - dragStartY.current) > DRAG_THRESHOLD;
    },
    [isMouseDown, isMouseDragging, dragStartX, dragStartY]
  );

  const doOnMouseDown = useCallback((e) => {
    const { clientX, clientY } = e;

    isMouseDown.current = true;
    isMouseDragging.current = false;
    dragStartX.current = clientX;
    dragStartY.current = clientY;
  }, []);

  const doOnMouseOut = useCallback(() => {
    setIsSelected(false);
  }, []);

  const doOnMouseOver = useCallback(() => {
    setIsSelected(true);
  }, []);

  const doOnTouchEnd = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation(); // Don't send this to the parent

      isTouchActive.current = false;

      if (isTouchDragging.current) {
        return;
      }

      openModalTooltip(tooltipData);
    },
    [isTouchDragging, openModalTooltip, tooltipData]
  );

  const doOnTouchMove = useCallback(
    (e: TouchEvent) => {
      const { clientX, clientY } = e.touches[0];

      isTouchDragging.current =
        isTouchDragging.current ||
        Math.abs(clientX - dragStartX.current) > DRAG_THRESHOLD ||
        Math.abs(clientY - dragStartY.current) > DRAG_THRESHOLD;
    },
    [isTouchDragging, dragStartX, dragStartY]
  );

  const doOnTouchStart = useCallback((e: TouchEvent) => {
    const { clientX, clientY } = e.touches[0];

    isTouchActive.current = true;
    isTouchDragging.current = false;
    dragStartX.current = clientX;
    dragStartY.current = clientY;
  }, []);

  useEffect(() => {
    const domElement = ref.current;

    if (domElement == null) {
      return () => {
        /* no-op */
      };
    }

    domElement.addEventListener("click", doOnClick, { passive: true });
    domElement.addEventListener("mousedown", doOnMouseDown, { passive: true });
    domElement.addEventListener("mousemove", doOnMouseMove, { passive: true });
    domElement.addEventListener("mouseout", doOnMouseOut, { passive: true });
    domElement.addEventListener("mouseover", doOnMouseOver, { passive: true });
    domElement.addEventListener("touchend", doOnTouchEnd, { passive: false });
    domElement.addEventListener("touchmove", doOnTouchMove, { passive: true });
    domElement.addEventListener("touchstart", doOnTouchStart, {
      passive: true,
    });

    return () => {
      domElement.removeEventListener("click", doOnClick);
      domElement.removeEventListener("mousedown", doOnMouseDown);
      domElement.removeEventListener("mousemove", doOnMouseMove);
      domElement.removeEventListener("mouseout", doOnMouseOut);
      domElement.removeEventListener("mouseover", doOnMouseOver);
      domElement.removeEventListener("touchend", doOnTouchEnd);
      domElement.removeEventListener("touchmove", doOnTouchMove);
      domElement.removeEventListener("touchstart", doOnTouchStart);
    };
  }, [
    doOnClick,
    doOnMouseDown,
    doOnMouseMove,
    doOnMouseOut,
    doOnMouseOver,
    doOnTouchEnd,
    doOnTouchMove,
    doOnTouchStart,
  ]);

  return (
    <>
      <ModalTooltip
        modalIsOpen={isModalTooltipOpen}
        onRequestClose={onRequestClose}
        tooltipData={{
          smallButtons:
            tooltipData.smallButtons ??
            (!!onClick
              ? [{ label: "Go", action: (e: any) => onClick(e) }]
              : []),
          ...tooltipData,
        }}
        disableTouchEvents
      />
      <TippyWrapper tooltipData={tooltipData} disabled={disabled}>
        <div ref={ref}>{children}</div>
      </TippyWrapper>
    </>
  );
}

type Props = Partial<TippyProps> & {
  onClick?: (...args: any) => any;
  tooltipData: ITooltipData;
};
