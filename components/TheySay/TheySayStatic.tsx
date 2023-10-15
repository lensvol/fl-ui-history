import React from "react";

export default function TheySayStatic({
  description,
}: {
  description: string;
}) {
  return (
    <p>
      <span className="they-say__content">{description}</span>
    </p>
  );
}
