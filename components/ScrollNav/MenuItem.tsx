import React, { Fragment, useMemo } from "react";
import classnames from "classnames";

import { ITooltipData } from "components/ModalTooltip/types";
import TippyWrapper from "components/TippyWrapper";

export default function MenuItem({ active, data, inverse, onClick }: Props) {
  const { description, icon, image, name } = data;

  const tooltipData = useMemo(
    () => ({
      description,
      image,
      name,
    }),
    [description, image, name]
  );

  const component = useMemo(
    () => (
      <button
        onClick={() => onClick(name)}
        type="button"
        className={classnames(
          "button--link nav__button",
          active && "menu-item--active",
          inverse && "button--link-inverse menu-item--inverse"
        )}
      >
        {icon && (
          <Fragment>
            <i className={`fa fa-fw fa-${icon}`} />{" "}
          </Fragment>
        )}
        {name}
      </button>
    ),
    [active, icon, inverse, name, onClick]
  );

  if (!image) {
    return <li className="nav__item">{component}</li>;
  }

  return (
    <li className="nav__item">
      <TippyWrapper tooltipData={tooltipData}>{component}</TippyWrapper>
    </li>
  );
}

type Props = {
  active: boolean;
  data: ITooltipData & { icon?: string };
  inverse?: boolean;
  onClick: (name: string | undefined) => void;
};
