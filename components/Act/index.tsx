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

export default function Act() {
  const dispatch = useAppDispatch();
  const socialAct = useAppSelector((state) => state.storylet.socialAct);
  const storylet = useAppSelector((state) => state.storylet.storylet);

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
    </ActContext.Provider>
  );
}

/*
interface State {
  eligibleFriends: IEligibleFriend[] | undefined,
  ineligibleContacts: { name: string, qualifies: string, correctInstance: string, youQualify: string }[],
  selectedContactId?: number,
}

class Act extends Component<Props, State> {
  mounted = false;

  static displayName = 'Act';

  state = {
    eligibleFriends: [],
    ineligibleContacts: [],
    selectedContactId: undefined,
  };

  componentDidMount = () => {
    const { socialAct } = this.props;
    const designatedFriend = socialAct?.inviteeData.designatedFriend;
    this.mounted = true;
    const { eligibleFriends } = socialAct?.inviteeData ?? { eligibleFriends: [] };
    this.setState({ eligibleFriends });

    // Update ineligible contacts
    this.fetchIneligibleContacts();

    // Try and set something useful as the default on mount: if we have a designated contact,
    // then set their ID as the selected contact ID; otherwise use the first contact in the list.
    if (designatedFriend) {
      this.setState({ selectedContactId: designatedFriend.id });
    }
    if (eligibleFriends?.length) {
      this.setState({ selectedContactId: eligibleFriends[0].id });
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleAddContact = ({ addedFriendId, eligibleFriends }: { addedFriendId: number, eligibleFriends: any[] }) => {
    // Update state with sorted list of eligible friends
    this.setState({ eligibleFriends: [...eligibleFriends.sort(sortEligibleFriends)] });
    // Go get ineligible contacts (they'll update asynchronously)
    this.fetchIneligibleContacts();
    // Try to find the added friend in the updated list of eligible friends and select them if so
    if (eligibleFriends.findIndex(friend => friend.id === addedFriendId) >= 0) {
      this.setState({ selectedContactId: addedFriendId });
    }
  };

  handleSelectContact = (e: any) => {
    // Check whether the ID we've been given is an eligible friend
    const { eligibleFriends } = this.state;

    const id = Number(e.target.value);

    // @ts-ignore
    if (eligibleFriends.find(_ => _.id === id)) {
      this.setState({ selectedContactId: id });
    }
  };

  fetchIneligibleContacts = async () => {
    const { dispatch, socialAct } = this.props;
    const id = socialAct?.branch.id;
    if (!id) {
      return;
    }
    try {
      // Fetch this branch's ineligible contacts from the server
      const { data: { ineligibleContacts } } = await new StoryletService().fetchIneligibleContacts(id); // Update state
      if (this.mounted) {
        this.setState({ ineligibleContacts });
      }
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));
        return;
      }
      throw e;
    }
  };

  render = () => {
    const { socialAct, storylet } = this.props;
    const branch = socialAct?.branch;
    const designatedContact = socialAct?.inviteeData.designatedFriend;
    const rootEventId = storylet?.id;

    if (!branch || !rootEventId) {
      return null;
    }

    const {
      eligibleFriends,
      ineligibleContacts,
      selectedContactId,
    } = this.state;

    const onAddContact = this.handleAddContact;
    const onSelectContact = this.handleSelectContact;

    return (
      <ActContext.Provider
        value={{
          ineligibleContacts,
          onAddContact,
          onSelectContact,
          selectedContactId,
        }}
      >
        <div className="act">
          <StoryletRoot
            data={branch}
            rootEventId={rootEventId}
          />

          <SelectContactOrDesignatedContact
            designatedFriend={designatedContact}
            eligibleFriends={eligibleFriends}
          />

          <InvitationForm
            designatedFriend={designatedContact}
            eligibleFriends={eligibleFriends}
            ineligibleContacts={ineligibleContacts}
            selectedContactId={selectedContactId}
          />
        </div>
      </ActContext.Provider>
    );
  }
}

const mapStateToProps = ({
  storylet: {
    socialAct,
    storylet,
  },
}: IAppState) => ({
  socialAct,
  storylet,
});

interface Props extends ReturnType<typeof mapStateToProps> {
  dispatch: ThunkDispatch<any, any, any>,
}

export default connect(mapStateToProps)(Act);

 */
