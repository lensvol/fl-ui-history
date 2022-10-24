import FateStoryCategorySelector from "components/Fate/FateStoryCategorySelector";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Sticky, StickyContainer } from "react-sticky";
import Waypoint from "react-waypoint";

import { FateCard } from "components/Fate/FateCard";
import FateStoryScrollNav from "components/Fate/FateStoryScrollNav";
import {
  DUMMY_YEAR_FOR_UNDATED_STORIES,
  containsMatchAnywhereInCard,
} from "components/Fate/utils";
import MediaLgUp from "components/Responsive/MediaLgUp";
import MediaMdDown from "components/Responsive/MediaMdDown";
import SearchField from "components/SearchField";
import { IFateCard } from "types/fate";
import scrollToComponent from "utils/scrollToComponent";

export default function AvailableStoryList({ cards, onClick }: Props) {
  const fateCardsContainerRef = useRef<HTMLDivElement>(null);
  const [filterString, setFilterString] = useState("");
  const [activeYear, setActiveYear] = useState<number | undefined>(undefined);

  const handleClickScrollNavItem = useCallback((year: number) => {
    scrollToComponent(
      fateCardsContainerRef.current?.querySelector(`[data-year="${year}"]`),
      { offset: 0, align: "top" }
    );
  }, []);

  const handleEnterWaypoint = useCallback(({ year }: { year: number }) => {
    setActiveYear(year);
  }, []);

  const components = useMemo(
    () =>
      [...cards]
        .filter((card) => containsMatchAnywhereInCard(card, filterString))
        .reduce((acc, next, idx, src) => {
          // const nextCardYear = findYear(next) ?? DUMMY_YEAR_FOR_UNDATED_STORIES;
          const nextCardYear = new Date(next.releaseDate).getFullYear();

          const nextCardComponent = (
            <FateCard key={next.id} data={next} onClick={onClick} story />
          );

          if (
            idx <= 0 ||
            new Date(src[idx - 1].releaseDate).getFullYear() !== nextCardYear
          ) {
            return [
              ...acc,
              <YearWaypointHeader
                key={nextCardYear}
                year={nextCardYear}
                onEnter={handleEnterWaypoint}
              />,
              nextCardComponent,
            ];
          }
          return [...acc, nextCardComponent];
        }, [] as React.ReactNode[]),
    [cards, filterString, handleEnterWaypoint, onClick]
  );

  if (!cards.length) {
    return <div style={{ textAlign: "center" }}>Nothing available.</div>;
  }

  return (
    <>
      <MediaLgUp>
        <StickyContainer style={{ height: "auto" }} className="row">
          <div className="nav nav--stacked nav--stacked--1-of-4 nav--stacked--roman possessions__menu">
            <Sticky>
              {({ style }) => (
                <FateStoryScrollNav
                  active={activeYear?.toString()}
                  cards={cards}
                  onClickItem={handleClickScrollNavItem}
                  style={style}
                />
              )}
            </Sticky>
          </div>
          <div className="stack-content stack-content--3-of-4">
            <SearchField
              onChange={(evt) => setFilterString(evt.currentTarget.value)}
              style={{ marginTop: 0 }}
              value={filterString}
            />
            <div className="fate-cards" ref={fateCardsContainerRef}>
              {components}
            </div>
          </div>
        </StickyContainer>
      </MediaLgUp>

      <MediaMdDown>
        <SearchField
          onChange={(evt) => setFilterString(evt.currentTarget.value)}
          value={filterString}
          style={{ marginTop: 0 }}
        />

        <FateStoryCategorySelector
          cards={cards}
          gotoItem={({ name }) => handleClickScrollNavItem(name)}
        />

        <div ref={fateCardsContainerRef}>{components}</div>
      </MediaMdDown>
    </>
  );
}

function YearWaypointHeader({
  onEnter,
  year,
}: {
  onEnter: (arg?: any) => void;
  year: number;
}) {
  return (
    <Waypoint onEnter={() => onEnter({ year })} bottomOffset="70%">
      <h2
        key={year}
        className="heading heading--2 quality-group__name"
        style={{
          marginTop: "1rem",
        }}
        data-year={year}
      >
        {year === DUMMY_YEAR_FOR_UNDATED_STORIES ? "Undated" : year}
      </h2>
    </Waypoint>
  );
}

type Props = {
  cards: IFateCard[];
  onClick: (card: IFateCard) => void;
};
