import React, { useCallback, useEffect, useState } from "react";

import { connect } from "react-redux";

import classnames from "classnames";

import store from "store";

import badgeAlert from "assets/img/badge-alert.png";

import Storylet from "components/Storylet";

import { IAppState } from "types/app";

function PersistentStoryletContainer({ settingId, storylets }: Props) {
  const storyletMapStorageKey = "hidden_storylets";
  const showStoryletsStorageKey = "show_storylets";
  const disclosureUsedAtStorageKey = "disclosure_used_at";

  const now = new Date().getTime();
  const then = store.get(disclosureUsedAtStorageKey) ?? now;
  const daysClosed = Math.floor((now - then) / (1000 * 60 * 60 * 24));

  const storedStoryletMap = store.get(storyletMapStorageKey) ?? {};
  const storedStoryletIds: number[] = storedStoryletMap[settingId] ?? [];

  const oldStorylets =
    storylets?.filter((slet) =>
      storedStoryletIds.some((hsid) => hsid === slet.id)
    ) ?? [];
  const newStorylets =
    storylets?.filter(
      (slet) => !storedStoryletIds.some((hsid) => hsid === slet.id)
    ) ?? [];

  const [isOpen, setIsOpen] = useState(
    newStorylets.length > 0 ||
      (store.get(showStoryletsStorageKey) ?? true) ||
      daysClosed >= 7
  );

  const updateStoredStoryletMap = useCallback(async () => {
    storedStoryletMap[settingId] = oldStorylets?.map((slet) => slet.id);

    store.set(storyletMapStorageKey, storedStoryletMap);
  }, [oldStorylets, settingId, storedStoryletMap]);

  const onTogglePersistentDeck = useCallback(async () => {
    storedStoryletMap[settingId] = storylets?.map((slet) => slet.id);

    store.set(storyletMapStorageKey, storedStoryletMap);
    store.set(showStoryletsStorageKey, !isOpen);
    store.set(disclosureUsedAtStorageKey, new Date().getTime());

    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen, settingId, storedStoryletMap, storylets]);

  const beforeHandleClick = useCallback(
    async (storyletId: number) => {
      // add this storylet ID to the list of 'seen' stories, so the badge will disappear
      storedStoryletMap[settingId] = [...storedStoryletIds, storyletId];

      store.set(storyletMapStorageKey, storedStoryletMap);
    },
    [settingId, storedStoryletIds, storedStoryletMap]
  );

  const stories = storylets?.length === 1 ? "Story" : "Stories";
  const buttonletDescription = isOpen
    ? "Hide Fifth City Stories"
    : "Show " + storylets?.length + " Fifth City " + stories;
  const [pageDidLoad, setPageDidLoad] = useState(false);

  useEffect(() => {
    if (pageDidLoad) {
      // only let this effect run once
      return;
    }

    store.set(showStoryletsStorageKey, isOpen);

    updateStoredStoryletMap();

    setPageDidLoad(true);
  }, [isOpen, pageDidLoad, setPageDidLoad, updateStoredStoryletMap]);

  if (!(storylets && storylets.length)) {
    return null;
  }

  return (
    <div
      className={classnames(
        "persistent--disclosure-wrapper",
        isOpen && "persistent--disclosure-wrapper--open"
      )}
    >
      <div className="persistent--disclosure-container">
        <button
          className="persistent--disclosure-control"
          onClick={onTogglePersistentDeck}
          type="button"
        >
          {buttonletDescription}{" "}
          <span
            className={classnames(
              "fa",
              isOpen ? "fa-chevron-up" : "fa-chevron-down"
            )}
          ></span>
        </button>
      </div>
      {isOpen &&
        newStorylets.map((storylet) => (
          <Storylet
            key={storylet.id}
            data={storylet}
            badge={{
              alt: "Newly Unlocked",
              icon: badgeAlert,
              type: "asset",
              className: "storylet--alert--badge",
              tooltipData: {
                description: "Newly Unlocked",
              },
            }}
            beforeHandleClick={beforeHandleClick}
          />
        ))}
      {isOpen &&
        oldStorylets.map((storylet) => (
          <Storylet key={storylet.id} data={storylet} />
        ))}
    </div>
  );
}

PersistentStoryletContainer.displayName = "PersistentStoryletContainer";

const mapStateToProps = (state: IAppState) => {
  const { myself, storylet } = state;

  return {
    settingId: myself.character.setting?.id ?? 0,
    storylets: storylet.storylets?.filter(
      (slet) => slet.deckType === "Persistent"
    ),
  };
};

export type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(PersistentStoryletContainer);
