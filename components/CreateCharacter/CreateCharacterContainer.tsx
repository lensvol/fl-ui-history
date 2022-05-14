import React, {
  ChangeEvent,
  Component,
  Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';

import {
  checkAvailability,
  createCharacter,
} from 'actions/registration';
import { fetchUser } from 'actions/user';

import Loading from 'components/Loading';
import { IAppState } from 'types/app';

import { Success } from 'services/BaseMonadicService';
import CreateCharacterComponent from './CreateCharacterComponent';
import CharacterNameContext from './CharacterNameContext';
import ConfirmCancelCreateModal from './components/ConfirmCancelCreateModal';

type State = {
  avatar: string | undefined,
  errors: any,
  gender: any | undefined,
  isCheckingAvailability: boolean,
  isConfirmCancelModalOpen: boolean,
  isFetching: boolean,
  isSubmitting: boolean,
  userName: string,
  userNameIsAvailable: boolean,
};

export class CreateCharacterContainer extends Component<Props, State> {
  mounted = false;

  static displayName = 'CreateCharacterContainer';

  state: State = {
    avatar: undefined,
    gender: undefined,
    errors: {},
    isCheckingAvailability: false,
    isConfirmCancelModalOpen: false,
    isFetching: false,
    isSubmitting: false,
    userName: '',
    userNameIsAvailable: false,
  };

  componentDidMount = async () => {
    const { dispatch } = this.props;
    // We're mounted
    this.mounted = true;
    // Fetch the user state
    this.setState({ isFetching: true });
    const result = await dispatch(fetchUser());
    if (result instanceof Success) {
      const { user: { name: userName } } = result.data;
      if (userName) {
        this.setState({ userName, isFetching: false }, () => {
          // Validate the user name after setting state
          this.handleBlurName();
        });
      }
    }
  };

  handleBlurName = async () => {
    const { dispatch } = this.props;
    const { errors, userName } = this.state;
    this.setState({
      isCheckingAvailability: true,
      userNameIsAvailable: false,
      errors: {
        ...errors,
        userName: undefined,
      },
    });
    try {
      // const { isSuccess } = await dispatch(checkAvailability(userName));
      const result = await dispatch(checkAvailability(userName));

      const { isSuccess } = result;

      this.setState(state => ({
        isCheckingAvailability: false,
        userNameIsAvailable: isSuccess,
        errors: {
          ...state.errors,
          userName: isSuccess ? undefined : `'${userName}' is taken.`,
        },
      }));
    } catch (e) {
      // TODO: handle actual errors
    }
  };

  handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      userName: e.target.value,
      userNameIsAvailable: false,
    });
  };

  handleChangeGender = (gender: any) => {
    this.setState({ gender });
  };

  handleCloseCancelModal = () => {
    this.setState({ isConfirmCancelModalOpen: false });
  };

  handleRequestCancel = () => {
    this.setState({ isConfirmCancelModalOpen: true });
  };

  handleSelectAvatar = (avatar: string) => {
    this.setState({ avatar });
  };

  handleSubmit = async () => {
    const { dispatch, history } = this.props;
    const { avatar, gender, userName } = this.state;
    this.setState({ isSubmitting: true });
    // Send to the character-creation endpoint
    const result = await dispatch(createCharacter({ avatar, gender, userName }));
    const { isSuccess } = result;
    if (isSuccess) {
      history.push('/');
    }
  };

  render = () => {
    const {
      avatar,
      errors,
      isCheckingAvailability,
      isConfirmCancelModalOpen,
      isFetching,
      isSubmitting,
      gender,
      userName,
      userNameIsAvailable,
    } = this.state;

    if (isFetching) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            height: '100vh',
            width: '100vw',
            top: '0',
            left: '0',
          }}
        >
          <Loading spinner />
        </div>
      );
    }

    const canSubmit = !!(
      avatar !== undefined
      && gender !== undefined
      && userName.length
      && userNameIsAvailable
    );

    return (
      <CharacterNameContext.Provider
        value={{
          isCheckingAvailability,
          isAvailable: userNameIsAvailable,
          error: errors.userName,
          onBlur: this.handleBlurName,
          onChange: this.handleChangeName,
          value: userName,
        }}
      >
        <Fragment>
          <CreateCharacterComponent
            avatar={avatar}
            canSubmit={canSubmit}
            errors={errors}
            gender={gender}
            isSubmitting={isSubmitting}
            onChangeGender={this.handleChangeGender}
            onRequestCancel={this.handleRequestCancel}
            onSelectAvatar={this.handleSelectAvatar}
            onSubmit={this.handleSubmit}
          />
          <ConfirmCancelCreateModal
            isOpen={isConfirmCancelModalOpen}
            onRequestClose={this.handleCloseCancelModal}
          />
        </Fragment>
      </CharacterNameContext.Provider>
    );
  }
}

const mapStateToProps = ({ user }: IAppState) => ({ user });

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps> & {
  dispatch: Function, // eslint-disable-line
};

export default withRouter(connect(mapStateToProps)(CreateCharacterContainer));