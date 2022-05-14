import React, {
  SyntheticEvent,
  useCallback,
  useMemo,
} from 'react';
import { openModalTooltip } from 'actions/modalTooltip';
import classnames from 'classnames';
import { ImageProps } from 'components/Image/props';
import Interactive, { ClickType } from 'react-interactive';
import {
  connect,
  useDispatch,
} from 'react-redux';
import getImagePath from 'utils/getImagePath';
import TippyWrapper from 'components/TippyWrapper';

type Props = ImageProps;

function ImageComponent(props: Props) {
  const {
    alt,
    alwaysTriggerOnClick,
    className,
    defaultCursor,
    height,
    icon,
    onClick,
    style,
    tooltipData,
    type,
    width,
    interactiveProps = {},
  } = props;

  const noop = () => { /* do nothing */ };

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
    const imagePath = getImagePath({ icon, type });
    dispatch(openModalTooltip({ ...tooltipData, imagePath }));
  }, [
    dispatch,
    icon,
    tooltipData,
    type,
  ]);

  const handleClick = useCallback((evt: SyntheticEvent, clickType: ClickType) => {
    if (alwaysTriggerOnClick) {
      return onClick?.(evt);
    }

    // If we received a mouse click, then just run the 'onClick' handler that
    // we were given
    if (clickType === 'mouseClick') {
      return onClick?.(evt);
    }
    // Otherwise, this was a tap event (or similar) that requires us to show
    // the info tooltip (with action buttons)
    return showModal();
  }, [
    alwaysTriggerOnClick,
    onClick,
    showModal,
  ]);

  const img = useMemo(() => (
    <img
      alt={alt}
      aria-label={alt}
      className={classnames(
        defaultCursor && 'cursor-default',
        className,
      )}
      height={height}
      onClick={imgElementOnClick}
      onKeyUp={imgElementOnClick}
      src={getImagePath({ icon, type })}
      style={style}
      width={width}
    />
  ), [
    alt,
    className,
    defaultCursor,
    height,
    icon,
    imgElementOnClick,
    style,
    type,
    width,
  ]);

  if (!tooltipData) {
    return img;
  }


  return (
    <Interactive
      as="div"
      aria-label={alt ?? ''}
      onClick={handleClick}
      style={{ ...(defaultCursor ? { cursor: 'default' } : {}) }}
      {...interactiveProps}
    >
      <TippyWrapper
        tooltipData={tooltipData}
      >
        {img}
      </TippyWrapper>
    </Interactive>
  );
}

export default connect()(ImageComponent);
