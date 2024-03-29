import React from "react";

import ResponsiveFooter from "components/Responsive/ResponsiveFooter";
import MediaMdDown from "components/Responsive/MediaMdDown";
import MediaLgUp from "components/Responsive/MediaLgUp";
import FooterContent from "./components/FooterContent";

export default function Footer() {
  return (
    <div>
      <MediaMdDown>
        <ResponsiveFooter />
      </MediaMdDown>
      <MediaLgUp>
        <footer className="content container u-space-above">
          <div>
            <FooterContent />
          </div>
        </footer>
      </MediaLgUp>
    </div>
  );
}

Footer.displayName = "Footer";
