import React from "react";

export default function WorldQualityDescription() {
  return (
    <div className="tooltip__world-quality-description">
      <i
        className="fl fl-ico fl-ico-world"
        style={{
          backgroundColor: "#efefef",
          marginRight: ".25rem",
        }}
      />
      <span
        style={{
          fontStyle: "italic",
        }}
      >
        World quality
      </span>
    </div>
  );
}
