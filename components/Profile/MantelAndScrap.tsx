import React from "react";
import { useAppSelector } from "features/app/store";
import DisplayItem from "./DisplayItem";

export default function MantelAndScrapContainer() {
  const mantelpieceItem = useAppSelector(
    (s) => s.profile.profileCharacter?.mantelpieceItem
  );
  const scrapbookStatus = useAppSelector(
    (s) => s.profile.profileCharacter?.scrapbookStatus
  );

  return (
    <div className="profile__mantel-and-scrap">
      {mantelpieceItem && (
        <DisplayItem quality={mantelpieceItem} label="Mantelpiece" />
      )}
      {scrapbookStatus && (
        <DisplayItem quality={scrapbookStatus} label="Scrapbook" />
      )}
    </div>
  );
}
