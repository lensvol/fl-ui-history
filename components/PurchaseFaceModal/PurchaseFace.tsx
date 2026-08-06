import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import { fetch as fetchAvatars } from "actions/registration";

import Loading from "components/Loading";
import Avatar from "components/PurchaseFaceModal/Avatar";
import ConfirmModal from "components/PurchaseFaceModal/ConfirmModal";
import NotEnoughFateWarning from "components/PurchaseFaceModal/NotEnoughFateWarning";

import getFaceChangeFateCost from "selectors/fate/getFaceChangeFateCost";
import getCanChangeFaceForFree from "selectors/myself/getCanChangeFaceForFree";

import { useAppSelector } from "features/app/store";

type Props = {
  onRequestClose: (_args?: any) => void;
};

export default function PurchaseFace({ onRequestClose }: Props) {
  const avatars = useAppSelector((state) => state.registration.avatars);
  const currentFate = useAppSelector((state) => state.fate.data.currentFate);
  const canChangeFaceForFree = useAppSelector((state) =>
    getCanChangeFaceForFree(state)
  );
  const fateCost = useAppSelector((state) => getFaceChangeFateCost(state));

  const dispatch = useDispatch();

  const [hasLoadedAvatars, setHasLoadedAvatars] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(
    undefined
  );

  const canAffordFaceChange = useMemo(
    () => fateCost !== undefined && currentFate >= fateCost,
    [currentFate, fateCost]
  );

  const handleAvatarClick = useCallback((avatar: string) => {
    setSelectedAvatar(avatar);
    setIsConfirmModalOpen(true);
  }, []);

  useEffect(() => {
    asyncUseEffect();

    async function asyncUseEffect() {
      await dispatch(fetchAvatars());
      setHasLoadedAvatars(true);
    }
  }, [dispatch]);

  if (!hasLoadedAvatars) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Loading spinner />
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          flex: 1,
        }}
      >
        <h3 className="heading heading--2 heading--inverse">
          Change your face
        </h3>

        {fateCost > 0 && (
          <NotEnoughFateWarning
            currentFate={currentFate}
            isFree={canChangeFaceForFree}
            fateCost={fateCost}
          />
        )}

        {canChangeFaceForFree && (
          <div>
            You have an opportunity to change your face. Choose your new face
            below.
          </div>
        )}

        <hr />

        <div>
          <ul
            className="list--unstyled avatar-list"
            style={{
              maxHeight: "60vh",
              overflowY: "scroll",
            }}
          >
            {avatars.map((avatar) => (
              <li
                key={avatar}
                className={classnames(
                  "avatar-list__item",
                  !(canChangeFaceForFree || canAffordFaceChange) &&
                    "avatar-list__item--disabled"
                )}
              >
                <Avatar avatar={avatar} onClick={handleAvatarClick} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ConfirmModal
        avatar={selectedAvatar}
        isOpen={isConfirmModalOpen}
        onConfirm={() => {
          // no-op
        }}
        onRequestClose={() => setIsConfirmModalOpen(false)}
        onRequestCloseModalStack={() => {
          setIsConfirmModalOpen(false);
          onRequestClose();
        }}
      />
    </>
  );
}

PurchaseFace.displayName = "PurchaseFace";
