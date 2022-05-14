import React from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';

import { ITooltipData } from 'components/ModalTooltip/types';
import Tooltip from 'components/Tooltip';

type Props = Partial<TippyProps> & { tooltipData?: ITooltipData };

export default function TippyWrapper(props: Props) {
  const {
    children,
    content,
    tooltipData,
    ...restProps
  } = props;
  return (
    <Tippy
      content={tooltipData ? <Tooltip data={tooltipData} /> : content}
      duration={0}
      placement="bottom"
      touch={false}
      {...restProps}
    >
      {children}
    </Tippy>
  );
}
