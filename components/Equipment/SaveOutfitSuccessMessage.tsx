import React from "react";
import classnames from "classnames";

export default function SaveOutfitSuccessMessage({
  isHiding,
  message,
}: {
  isHiding: boolean;
  message?: string;
}) {
  return (
    <div
      className={classnames(
        "outfit-controls__save-outfit-success-message",
        isHiding && "outfit-controls__save-outfit-success-message--is-hiding"
      )}
    >
      <i className="fa fa-check" />
      <span style={{ marginLeft: "8px" }}>{message ?? "Outfit updated"}</span>
    </div>
  );
}
