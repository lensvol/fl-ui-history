import React, { Fragment, useMemo } from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import classnames from "classnames";

import { EquipmentContextValue } from "components/Equipment/EquipmentContext";
import Image from "components/Image";

import { IEnhancement } from "types/qualities";

import { createEquipmentQualityAltText } from "utils";

function EffectItem(props: Props) {
  const { description, enhancements, id, image, level, name, useEventId } =
    props;

  const tooltipData = {
    description,
    enhancements,
    id,
    image,
    level,
    name,
    useEventId,
  };

  const altText = useMemo(
    () =>
      createEquipmentQualityAltText({
        description,
        enhancements,
        name,
      }),
    [description, enhancements, name]
  );

  return (
    <Fragment>
      <div className={classnames("effect-item")} data-quality-id={id}>
        <Image
          className={classnames("effect-item__image")}
          icon={image}
          alt={altText}
          type="small-icon"
          tooltipData={tooltipData}
          defaultCursor={true}
        />
        {level > 1 && (
          <span className="js-item-value icon__value">{level}</span>
        )}
      </div>
    </Fragment>
  );
}

EffectItem.displayName = "EffectItem";

type OwnProps = {
  description: string;
  enhancements?: IEnhancement[];
  id: number;
  image: string;
  level: number;
  name: string;
  useEventId?: number;
};

type Props = OwnProps &
  RouteComponentProps &
  Pick<EquipmentContextValue, "openUseOrEquipModal">;

export default withRouter(EffectItem);
