import React, { Component } from "react";
import StoryletRoot from "components/StoryletRoot";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { VersionMismatch } from "services/BaseService";
import { handleVersionMismatch } from "actions/versionSync";

import StoryletService from "services/StoryletService";

import { IAppState } from "types/app";
import { IEligibleFriend } from "types/storylet";
import InvitationForm from "./components/InvitationForm";
import sortEligibleFriends from "./sortEligibleFriends";
import ActContext from "./ActContext";
import SelectContactOrDesignatedContact from "./SelectContactOrDesignatedContact";

interface State {
  eligibleFriends: IEligibleFriend[] | undefined;
  ineligibleContacts: {
    name: string;
    qualifies: string;
    correctInstance: string;
    youQualify: string;
  }[];
  selectedContactId?: number;
}

class Act extends Component<Props, State> {
  mounted = false;

  static displayName = "Act";

  state = {
    eligibleFriends: [],
    ineligibleContacts: [],
    selectedContactId: undefined,
  };

  componentDidMount = () => {
    const { socialAct } = this.props;
    const designatedFriend = socialAct?.inviteeData.designatedFriend;
    this.mounted = true;
    const { eligibleFriends } = socialAct?.inviteeData ?? {
      eligibleFriends: [],
    };
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

  handleAddContact = ({
    addedFriendId,
    eligibleFriends,
  }: {
    addedFriendId: number;
    eligibleFriends: any[];
  }) => {
    // Update state with sorted list of eligible friends
    this.setState({
      eligibleFriends: [...eligibleFriends.sort(sortEligibleFriends)],
    });
    // Go get ineligible contacts (they'll update asynchronously)
    this.fetchIneligibleContacts();
    // Try to find the added friend in the updated list of eligible friends and select them if so
    if (
      eligibleFriends.findIndex((friend) => friend.id === addedFriendId) >= 0
    ) {
      this.setState({ selectedContactId: addedFriendId });
    }
  };

  handleSelectContact = (e: any) => {
    // Check whether the ID we've been given is an eligible friend
    const { eligibleFriends } = this.state;

    const id = Number(e.target.value);

    // @ts-ignore
    if (eligibleFriends.find((_) => _.id === id)) {
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
      const {
        data: { ineligibleContacts },
      } = await new StoryletService().fetchIneligibleContacts(id); // Update state
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

    const { eligibleFriends, ineligibleContacts, selectedContactId } =
      this.state;

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
          <StoryletRoot data={branch} rootEventId={rootEventId} />

          <SelectContactOrDesignatedContact
            designatedFriend={designatedContact}
            eligibleFriends={eligibleFriends}
          />

          <InvitationForm
            designatedFriend={designatedContact}
            eligibleFriends={eligibleFriends}
            selectedContactId={selectedContactId}
          />
        </div>
      </ActContext.Provider>
    );
  };
}

const mapStateToProps = ({ storylet: { socialAct, storylet } }: IAppState) => ({
  socialAct,
  storylet,
});

interface Props extends ReturnType<typeof mapStateToProps> {
  dispatch: ThunkDispatch<any, any, any>;
}

export default connect(mapStateToProps)(Act);
