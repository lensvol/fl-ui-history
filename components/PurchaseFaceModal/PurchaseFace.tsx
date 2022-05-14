import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { fetch as fetchAvatars } from 'actions/registration';
import Loading from 'components/Loading';

import { ThunkDispatch } from 'redux-thunk';
import getFaceChangeFateCost from 'selectors/fate/getFaceChangeFateCost';
import getCanChangeFaceForFree from 'selectors/myself/getCanChangeFaceForFree';
import { IAppState } from 'types/app';
import NotEnoughFateWarning from './NotEnoughFateWarning';
import Avatar from './Avatar';
import ConfirmModal from './ConfirmModal';

export function PurchaseFace(props: Props) {
  const {
    avatars,
    canChangeFaceForFree,
    currentFate,
    dispatch,
    fateCost,
    onRequestClose,
  } = props;

  const [hasLoadedAvatars, setHasLoadedAvatars] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(undefined);

  const canAffordFaceChange = useMemo(
    () => (fateCost !== undefined) && currentFate >= fateCost,
    [currentFate, fateCost],
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
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Loading spinner />
      </div>
    );
  }

  return (
    <>
      <div
        style={{ flex: 1 }}
      >
        <h3 className="heading heading--2 heading--inverse">Change your face</h3>
        {(fateCost > 0) && (
          <NotEnoughFateWarning
            currentFate={currentFate}
            isFree={canChangeFaceForFree}
            fateCost={fateCost}
          />
        )}
        {canChangeFaceForFree && (
          <div>
            You have an opportunity to change your face. Choose your new face below.
          </div>
        )}
        <hr />
        <div>
          <ul
            className="list--unstyled avatar-list"
            style={{
              maxHeight: '60vh',
              overflowY: 'scroll',
            }}
          >
            {avatars.map(avatar => (
              <li
                key={avatar}
                className={classnames(
                  'avatar-list__item',
                  !(canChangeFaceForFree || canAffordFaceChange) && 'avatar-list__item--disabled',
                )}
              >
                <Avatar
                  avatar={avatar}
                  onClick={handleAvatarClick}
                />
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

/*
export class PurchaseFace extends Component<Props, State> {
  state = {
    hasLoadedAvatars: false,
  };

  componentDidMount = async () => {
    const { dispatch } = this.props;
    await dispatch(fetchAvatars());
    this.setState({ hasLoadedAvatars: true });
  };

  handleGoToBuyFate = () => {
    const { history } = this.props;
    history.push('/fate');
  };

  render = () => {
    const {
      avatars,
      currentFate,
      isFree,
      onRequestClose,
      data: activePurchase,
    } = this.props;
    const { hasLoadedAvatars } = this.state;

    if (!activePurchase) {
      return null;
    }

    if (!hasLoadedAvatars) {
      return <Loading spinner />;
    }

    const fateCost = FACE_CHANGE_FATE_COST;

    const onGoToBuyFate = this.handleGoToBuyFate;

    const canAffordFaceChange = currentFate >= fateCost;

    return (
      <div>
        <h3 className="heading heading--2 heading--inverse">Change your face</h3>
        <NotEnoughFateWarning
          currentFate={currentFate}
          isFree={isFree ?? false}
          fateCost={fateCost}
          onGoToBuyFate={onGoToBuyFate}
        />
        {isFree && <FreeFaceChangeRubric />}
        <hr />
        <div>
          <ul
            className="list--unstyled avatar-list"
            style={{
              maxHeight: '60vh',
              overflowY: 'scroll',
            }}
          >
            {avatars.map(avatar => (
              <li
                key={avatar}
                className={classnames(
                  'avatar-list__item',
                  !(isFree || canAffordFaceChange) && 'avatar-list__item--disabled',
                )}
              >
                <Avatar
                  activePurchase={activePurchase}
                  avatar={avatar}
                  disabled={!(isFree || canAffordFaceChange)}
                  isFree={isFree ?? false}
                  fateCost={fateCost}
                  onRequestClose={onRequestClose}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
*/

const mapStateToProps = ({
  fate,
  myself: { qualities },
  registration: { avatars },
}: IAppState) => ({
  avatars,
  currentFate: fate.data.currentFate,
  canChangeFaceForFree: getCanChangeFaceForFree({ myself: { qualities } }),
  fateCost: getFaceChangeFateCost({ fate }),
});

type Props = ReturnType<typeof mapStateToProps>
  & {
  dispatch: ThunkDispatch<any, any, any>,
  onRequestClose: (_args?: any) => void,
};

export default connect(mapStateToProps)(PurchaseFace);
