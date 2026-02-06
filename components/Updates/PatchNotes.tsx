import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

import { Sticky, StickyContainer } from "react-sticky";

import { fetchPatchNoteNavigation } from "actions/news/fetchPatchNoteNavigation";
import { fetchPatchNotes } from "actions/news/fetchPatchNotes";

import Loading from "components/Loading";
import ScrollNav from "components/ScrollNav";

import { Success } from "services/BaseMonadicService";
import { PatchNoteResponse } from "services/NewsService";

export default function PatchNotes() {
  const dispatch = useDispatch();

  const [isLoadingYears, setIsLoadingYears] = useState(false);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [didLoad, setDidLoad] = useState(false);
  const [years, setYears] = useState<number[]>([]);
  const [currentYear, setCurrentYear] = useState(0);
  const [patchNotes, setPatchNotes] = useState<PatchNoteResponse[]>([]);

  useEffect(() => {
    if (didLoad) {
      // only run once
      return;
    }

    asyncUseEffect();

    async function asyncUseEffect() {
      setIsLoadingYears(true);
      setIsLoadingNotes(true);

      const yearsResult = await dispatch(fetchPatchNoteNavigation());

      var theYears: number[] = [];

      if (yearsResult instanceof Success) {
        theYears = yearsResult.data;

        setYears(theYears);
      }

      setIsLoadingYears(false);

      if (theYears.length === 0) {
        setCurrentYear(0);
      } else {
        setCurrentYear(theYears[0]);

        // get patch notes for year
        const yearResult = await dispatch(fetchPatchNotes(theYears[0]));

        if (yearResult instanceof Success) {
          setPatchNotes(yearResult.data);
        } else {
          setPatchNotes([]);
        }
      }

      setIsLoadingNotes(false);
      setDidLoad(true);
    }
  }, [didLoad, dispatch]);

  const navItems = useMemo(() => {
    return years.map((year) => ({
      id: year,
      name: year.toString(),
    }));
  }, [years]);

  const showYear = useCallback(
    async (navItem) => {
      const year = navItem.id;

      if (year === currentYear) {
        // no change; no point in reloading
        return;
      }

      setIsLoadingNotes(true);

      // get patch notes for year
      const result = await dispatch(fetchPatchNotes(year));

      if (result instanceof Success) {
        setCurrentYear(year);
        setPatchNotes(result.data);
      }

      setIsLoadingNotes(false);
    },
    [currentYear, dispatch]
  );

  const handleSpoiler = useCallback((evt) => {
    const content = evt.target;
    const wrapper = content.parentElement;

    // toggle the visibility
    wrapper.classList.toggle("hidden");

    // set aria attributes for screen readers
    if (wrapper.classList.contains("hidden")) {
      wrapper.setAttribute("aria-expanded", false);
      wrapper.setAttribute("role", "button");
      wrapper.setAttribute("aria-label", "spoiler");

      content.setAttribute("aria-hidden", true);
    } else {
      wrapper.setAttribute("aria-expanded", true);
      wrapper.setAttribute("role", "presentation");
      wrapper.removeAttribute("aria-label");

      content.setAttribute("aria-hidden", false);
    }
  }, []);

  return (
    <>
      <hr />
      <h2 className="heading heading--2">Patch Notes</h2>
      <StickyContainer
        className="row"
        style={{
          height: "auto",
        }}
      >
        <div className="nav nav--stacked nav--stacked--1-of-4 nav--stacked--roman">
          <Sticky>
            {({ style }) =>
              isLoadingYears ? (
                <Loading small spinner />
              ) : (
                <ScrollNav
                  style={style}
                  data={navItems}
                  gotoItem={showYear}
                  active={currentYear}
                />
              )
            }
          </Sticky>
        </div>
        {isLoadingNotes && <Loading spinner />}
        {!isLoadingNotes && currentYear === 0 ? (
          <div>There are no patch notes available.</div>
        ) : (
          <div className="stack-content stack-content--3-of-4">
            {patchNotes.map((note) => (
              <>
                <h3 className="heading heading--3">{note.title}</h3>
                <div
                  className="patch-note-wrapper"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                  onClick={handleSpoiler}
                />
              </>
            ))}
          </div>
        )}
      </StickyContainer>
    </>
  );
}

PatchNotes.displayName = "PatchNotes";
