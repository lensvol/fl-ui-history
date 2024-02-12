import { useAppDispatch, useAppSelector } from "features/app/store";
import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import StoryletRoot from "components/StoryletRoot";
import useIsMounted from "hooks/useIsMounted";
import { VersionMismatch } from "services/BaseService";
import { handleVersionMismatch } from "actions/versionSync";

import StoryletService from "services/StoryletService";

import { IEligibleFriend, IneligibleContact } from "types/storylet";
import InvitationForm from "./InvitationForm";
import sortEligibleFriends from "./sortEligibleFriends";
import ActContext from "./ActContext";
import SelectContactOrDesignatedContact from "./SelectContactOrDesignatedContact";
import EmailVerificationModal from "components/Act/EmailVerificationModal";

export default function Act() {
  const dispatch = useAppDispatch();
  const socialAct = useAppSelector((state) => state.storylet.socialAct);
  const storylet = useAppSelector((state) => state.storylet.storylet);
  const isFetchingSettings = useAppSelector(
    (state) => state.settings.isFetching
  );
  const socialActsAvailable = useAppSelector(
    (state) => state.settings.data.socialActsAvailable
  );

  const { branch, inviteeData } = socialAct ?? {};
  const designatedContact = inviteeData?.designatedFriend;
  const rootEventId = storylet?.id;

  const isMounted = useIsMounted();

  const branchId = branch?.id;

  const [ineligibleContacts, setIneligibleContacts] = useState<
    IneligibleContact[]
  >([]);
  const [isFetchingIneligibleContacts, setIsFetchingIneligibleContacts] =
    useState(false);
  const [eligibleFriends, setEligibleFriends] = useState<IEligibleFriend[]>(
    socialAct?.inviteeData.eligibleFriends ?? []
  );
  const [selectedContactId, setSelectedContactId] = useState<
    number | undefined
  >(undefined);
  const [shouldShowModalIfNeeded, setShouldShowModalIfNeeded] = useState(true);

  const fetchIneligibleContactsAsync = useCallback(async () => {
    if (!branchId) {
      return;
    }

    try {
      const { data } = await new StoryletService().fetchIneligibleContacts(
        branchId
      ); // Update state
      if (!isMounted.current) {
        return;
      }

      setIneligibleContacts(data.ineligibleContacts);
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));
        return;
      }
      throw e;
    }
  }, [branchId, dispatch, isMounted]);

  const handleAddContact = useCallback(
    async (payload: {
      addedFriendId: number;
      eligibleFriends: IEligibleFriend[];
    }) => {
      // Update state with sorted list of eligible friends
      setEligibleFriends([
        ...payload.eligibleFriends.sort(sortEligibleFriends),
      ]);
      // Try to find the added friend in the updated list of eligible friends and select them if so
      if (
        eligibleFriends.findIndex(
          (friend) => friend.id === payload.addedFriendId
        ) >= 0
      ) {
        setSelectedContactId(payload.addedFriendId);
      }
      // Go get ineligible contacts (they'll update asynchronously)
      setIsFetchingIneligibleContacts(true);
      await fetchIneligibleContactsAsync();
      if (isMounted.current) {
        setIsFetchingIneligibleContacts(false);
      }
    },
    [eligibleFriends, fetchIneligibleContactsAsync, isMounted]
  );

  const handleSelectContact = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const id = Number(e.target.value);
      if (eligibleFriends.find((_) => _.id === id)) {
        setSelectedContactId(id);
      }
    },
    [eligibleFriends]
  );

  const onRequestCloseModal = useCallback(() => {
    setShouldShowModalIfNeeded(false);
  }, []);

  useEffect(() => {
    setIsFetchingIneligibleContacts(true);

    fetchIneligibleContactsAsync().then(() => {
      if (!isMounted.current) {
        return;
      }

      setIsFetchingIneligibleContacts(false);

      if (designatedContact) {
        setSelectedContactId(designatedContact.id);
        return;
      }

      if (eligibleFriends?.length) {
        setSelectedContactId(eligibleFriends[0].id);
      }
    });

    return () => {
      /* no op */
    };
  }, [
    branchId,
    designatedContact,
    eligibleFriends,
    fetchIneligibleContactsAsync,
    isMounted,
  ]);

  if (!(branch && rootEventId)) {
    return null;
  }

  return (
    <ActContext.Provider
      value={{
        ineligibleContacts,
        selectedContactId,
        onAddContact: handleAddContact,
        onSelectContact: handleSelectContact,
      }}
    >
      <div className="act">
        <StoryletRoot data={branch} rootEventId={rootEventId} />

        <SelectContactOrDesignatedContact
          designatedFriend={designatedContact}
          eligibleFriends={eligibleFriends}
          isFetchingIneligibleContacts={isFetchingIneligibleContacts}
        />

        <InvitationForm
          designatedFriend={designatedContact}
          eligibleFriends={eligibleFriends}
          ineligibleContacts={ineligibleContacts}
          isFetchingIneligibleContacts={isFetchingIneligibleContacts}
          selectedContactId={selectedContactId}
        />
      </div>

      <EmailVerificationModal
        isOpen={
          shouldShowModalIfNeeded && !isFetchingSettings && !socialActsAvailable
        }
        onRequestClose={onRequestCloseModal}
      />
    </ActContext.Provider>
  );
}
