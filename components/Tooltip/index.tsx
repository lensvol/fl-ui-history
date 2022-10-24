import React from "react";

import { IQuality } from "types/qualities";
import TooltipButtons from "./TooltipButtons";
import TooltipDescription from "./TooltipDescription";
import TooltipImage from "./TooltipImage";

type Props = {
  data: Partial<IQuality> & { buttons?: any[]; secondaryDescription?: string };
};

export default function Tooltip({ data }: Props) {
  const { buttons, image } = data;

  return (
    <div className="tooltip">
      {image && <TooltipImage image={image} />}
      <div className={image ? "tooltip__desc" : "tooltip__desc__noImage"}>
        <TooltipDescription {...data} />
        {buttons && <TooltipButtons buttons={buttons} />}
      </div>
    </div>
  );
}
