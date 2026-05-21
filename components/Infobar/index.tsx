import React, { useMemo } from "react";

import Advert from "components/Infobar/Advert";
import MakeContacts from "components/Infobar/MakeContacts";
import Welcome from "components/Infobar/Welcome";
import MediaXlUp from "components/Responsive/MediaXlUp";
import Snippet from "components/Snippet";

import { useAppSelector } from "features/app/store";

import { UIRestriction } from "types/myself";

export default function Infobar() {
  const advert = useAppSelector((state) => state.infoBar.advert);
  const uiRestrictions = useAppSelector((state) => state.myself.uiRestrictions);
  const showMakeContacts = useAppSelector(
    (state) => state.infoBar.isSocialAvailable
  );

  const showExtrasUI =
    uiRestrictions === undefined ||
    !uiRestrictions.find((restriction) => restriction === UIRestriction.Extras);

  const currentArea = useAppSelector((state) => state.map.currentArea);
  const name = useAppSelector((state) => state.myself.character.name);

  const showAdvert = useMemo(() => {
    return (
      advert && advert.altText && advert.url && advert.image && showExtrasUI
    );
  }, [advert, showExtrasUI]);

  const showWelcome = useMemo(() => {
    return name && currentArea && currentArea?.name;
  }, [currentArea, name]);

  return (
    <MediaXlUp>
      <div className="col-tertiary">
        <div className="col-1-of-3">
          <div className="travel">
            {showWelcome && (
              <Welcome currentAreaName={currentArea!.name} name={name} />
            )}

            <br />
            <br />

            {showAdvert && (
              <Advert
                altText={advert!.altText}
                image={advert!.image}
                url={advert!.url}
              />
            )}

            {showExtrasUI && <Snippet />}

            {showMakeContacts && (
              <>
                <br />

                <div className="snippet">
                  <MakeContacts />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MediaXlUp>
  );
}

Infobar.displayName = "Infobar";
