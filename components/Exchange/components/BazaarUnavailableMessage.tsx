import React from "react";

export default function BazaarUnavailableMessage() {
  return (
    <div style={{ padding: "100px", textAlign: "center" }}>
      <h1 key="not-available">THE BAZAAR IS OUT OF BOUNDS AT THE MOMENT!</h1>
      <p>
        Regrettably, there is no access to the Bazaar from your current
        location.
      </p>
    </div>
  );
}
