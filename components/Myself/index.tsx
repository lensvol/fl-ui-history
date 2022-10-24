import CategorySelector from "components/CategorySelector";
import Name from "components/Myself/Name";
import Profile from "components/Myself/Profile";
import MediaLgUp from "components/Responsive/MediaLgUp";
import MediaMdDown from "components/Responsive/MediaMdDown";
import MediaSmDown from "components/Responsive/MediaSmDown";
import SearchField from "components/SearchField";
import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Sticky, StickyContainer } from "react-sticky";

import scrollToComponent from "utils/scrollToComponent";
import { categoryHasVisibleItems } from "components/utils";
import Loading from "components/Loading";
import getMyselfCategories from "selectors/myself/getMyselfCategories";

import { ICategory } from "types/possessions";
import { IAppState } from "types/app";
import InnerTabs from "components/InnerTabs";
import ScrollNav from "components/ScrollNav";
import QualityGroup from "./QualityGroup";

const mapStateToProps = (state: IAppState) => {
  const {
    myself: {
      qualities,
      character: { descriptiveText, name: characterName },
    },
    scrollToComponent: { scrolling },
  } = state;
  return {
    characterName,
    qualities,
    scrolling,
    descriptiveText: descriptiveText ?? "",
    categories: getMyselfCategories(state),
  };
};

type Props = ReturnType<typeof mapStateToProps>;

function MyselfContainer({
  categories,
  characterName,
  descriptiveText,
  qualities,
  scrolling,
}: Props) {
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

      scrollToComponent(
        document.querySelector(`[data-group-name="${name}"]`),
        { align: "top", duration: 1500, ...options },
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
          onEnterWaypoint={trackPosition}
          key={category.id}
          filterString={filterString}
          id={category.id}
          name={category.name}
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
      <div style={{ textAlign: "center" }}>
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
        <StickyContainer style={{ height: "auto" }} className="row">
          <div className="nav nav--stacked nav--stacked--1-of-4 nav--stacked--roman">
            <Sticky>
              {({ style }) => (
                <ScrollNav
                  style={style}
                  data={stickyMenuItems}
                  gotoItem={onGoToItem}
                  active={activeItem}
                  inverse
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
        <div style={{ position: "sticky", top: 0, zIndex: 1 }}>
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

export default connect(mapStateToProps)(MyselfContainer);
