import React from "react";

import { useFeature } from "flagged";

import { FEATURE_ENHANCED_EF } from "features/feature-flags";

interface Props {
  message: string;
  onClickToClose: () => void;
}

export default function ServerError({ message, onClickToClose }: Props) {
  const supportsEnhancedEF = useFeature(FEATURE_ENHANCED_EF);

  return (
    <div>
      <h1 className="heading heading--3">Something went wrong</h1>
      <p>
        Something went wrong and we weren't able to continue
        {!supportsEnhancedEF && <> with creating a subscription</>}. Please
        refresh the page and try again.
      </p>
      <p>Here's the error message:</p>
      <p
        style={{
          fontStyle: "italic",
          textAlign: "center",
        }}
        dangerouslySetInnerHTML={{ __html: message }}
      />
      <div className="buttons">
        <button
          className="button button--primary"
          type="button"
          onClick={onClickToClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
