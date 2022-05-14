import React from 'react';
import { IChooseBranchRequestData } from 'services/StoryletService';
import {
  IBranch,
  IStorylet,
} from 'types/storylet';
import GoBack from 'components/StoryletIn/GoBack';
import StoryletRoot from 'components/StoryletRoot';
import Branch from 'components/Branch';
import ExceptionalFriendModalContext from 'components/ExceptionalFriendModal/ExceptionalFriendModalContext';
import DomManipulationContext from 'components/DomManipulationContext';

export interface Props {
  onChooseBranch: (_: IBranch & IChooseBranchRequestData) => Promise<void>,
  onGoBack: () => void,
  storylet: IStorylet,
}

export function In(props: Props) {
  const {
    onChooseBranch,
    onGoBack,
    storylet,
  } = props;
  return (
    <ExceptionalFriendModalContext.Consumer>
      {({
        openModal,
      }) => (
        <div>
          <DomManipulationContext.Provider
            value={{
              // This gets passed in to the StoryletDescription to be attached as an onClick to
              // anything with data-purpose="open-subscription-modal"
              onOpenSubscriptionModal: openModal,
            }}
          >
            <StoryletRoot
              data={storylet}
              shareData={storylet}
            />
          </DomManipulationContext.Provider>
          <div style={{ marginLeft: '-.5rem' }}>
            {storylet.childBranches.map(branch => (

              <Branch
                branch={branch}
                isGoingBack={false}
                key={branch.id}
                onChooseBranch={onChooseBranch}
                storyletFrequency={storylet.frequency}
                defaultCursor
              />
            ))}
          </div>
          <div style={{ marginTop: '1rem' }}>
            <GoBack
              disabled={false}
              isGoingBack={false}
              onClick={onGoBack}
              storylet={storylet}
            />
          </div>
        </div>
      )}
    </ExceptionalFriendModalContext.Consumer>
  );
}

export default In;