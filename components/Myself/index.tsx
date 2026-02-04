import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Sticky, StickyContainer } from "react-sticky";

import CategorySelector from "components/CategorySelector";
import InnerTabs from "components/InnerTabs";
import Loading from "components/Loading";
import Name from "components/Myself/Name";
import Profile from "components/Myself/Profile";
import QualityGroup from "components/Myself/QualityGroup";
import MediaLgUp from "components/Responsive/MediaLgUp";
import MediaMdDown from "components/Responsive/MediaMdDown";
import MediaSmDown from "components/Responsive/MediaSmDown";
import SearchField from "components/SearchField";
import ScrollNav from "components/ScrollNav";
import { categoryHasVisibleItems } from "components/utils";

import { useAppSelector } from "features/app/store";

import getMyselfCategories from "selectors/myself/getMyselfCategories";

import { ICategory } from "types/possessions";

import scrollToComponent from "utils/scrollToComponent";

export default function MyselfContainer() {
  const categories = useAppSelector((state) => getMyselfCategories(state));
  const characterName = useAppSelector((state) => state.myself.character.name);
  const descriptiveText =
    useAppSelector((state) => state.myself.character.descriptiveText) ?? "";
  const qualities = useAppSelector((state) => state.myself.qualities);
  const scrolling = useAppSelector(
    (state) => state.scrollToComponent.scrolling
  );

  const dispatch = useDispatch();

  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [filterString, setFilterString] = useState("");

  const onFilterStringChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setFilterString(evt.currentTarget.value);
    },
    []
  );

  const onGoToItem = useCallback(
    (item: { id: number; name: string }, options: any) => {
      const { id, name } = item;

      setActiveItem(id);

      const scrollOptions = {
        align: "top",
        duration: 1500,
        ...options,
      };

      scrollToComponent(
        document.querySelector(`[data-group-name="${name}"]`),
        scrollOptions,
        dispatch
      );
    },
    [dispatch]
  );

  const trackPosition = useCallback(
    (id: number) => {
      if (!scrolling) {
        setActiveItem(id);
      }
    },
    [scrolling]
  );

  const qualityGroups = useMemo(
    () =>
      categories.map((category: ICategory) => (
        <QualityGroup
          filterString={filterString}
          id={category.id}
          key={category.id}
          name={category.name}
          onEnterWaypoint={trackPosition}
        />
      )),
    [categories, filterString, trackPosition]
  );

  const stickyMenuItems = useMemo(
    () =>
      categories
        .filter((category: ICategory) => category.name) // No nameless categories
        .filter(categoryHasVisibleItems({ filterString, qualities })),
    [categories, filterString, qualities]
  );

  // If we have no name, we don't have the character info we need to
  // build the page, so let's wait
  if (!characterName) {
    return (
      <div
        style={{
          textAlign: "center",
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <MediaSmDown>
        <InnerTabs />
      </MediaSmDown>

      <h1 className="heading heading--1 heading--close">
        <Name />
      </h1>
      <p
        className="lede"
        dangerouslySetInnerHTML={{ __html: descriptiveText }}
      />
      <hr />

      <MediaLgUp>
        <StickyContainer
          style={{
            height: "auto",
          }}
          className="row"
        >
          <div className="nav nav--stacked nav--stacked--1-of-4 nav--stacked--roman">
            <Sticky>
              {({ style }) => (
                <ScrollNav
                  active={activeItem}
                  data={stickyMenuItems}
                  gotoItem={onGoToItem}
                  inverse
                  style={style}
                />
              )}
            </Sticky>
          </div>
          <div className="stack-content stack-content--3-of-4">
            <Profile />
            <SearchField onChange={onFilterStringChange} value={filterString} />
            {qualityGroups}
          </div>
        </StickyContainer>
      </MediaLgUp>

      <MediaMdDown>
        <Profile />
        <SearchField onChange={onFilterStringChange} value={filterString} />
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <CategorySelector
            data={categories.filter((item) => item.name)}
            gotoItem={onGoToItem}
          />
        </div>
        {qualityGroups}
      </MediaMdDown>
    </div>
  );
}

MyselfContainer.displayName = "MyselfContainer";
