import React from "react";
import Image from "components/Image";
import { IQuality } from "types/qualities";

function MetaQuality(props: {
  data: Pick<IQuality, "image" | "name" | "level" | "description">;
}) {
  const {
    data: { image, name, level, description },
  } = props;
  return (
    <li className="metaqualities__quality clearfix">
      <div className="metaqualities__image">
        <Image icon={image} alt={name} type="icon" width={100} height={130} />
      </div>
      <div className="metaqualities__body">
        <p className="metaqualities__title">
          {name}{" "}
          <em>
            (Level:
            {level})
          </em>
        </p>
        <p dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </li>
  );
}

export default MetaQuality;
