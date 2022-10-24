import React from "react";

interface Props {
  message: string;
}

export default function ErrorState({ message }: Props) {
  return (
    <div>
      <h3 className="heading heading--2">{message}</h3>
      <hr style={{ marginTop: 0 }} />
      <p style={{ textAlign: "center" }}>
        This shouldn't have happened. Please contact
        <br />
        <a className="link--inverse" href="mailto:support@failbettergames.com">
          support@failbettergames.com
        </a>
        .
      </p>
    </div>
  );
}
