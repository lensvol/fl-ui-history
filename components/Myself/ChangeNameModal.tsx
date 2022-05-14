import classnames from 'classnames';
import Loading from 'components/Loading';
import {
  Field,
  Form,
  Formik,
} from 'formik';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Link,
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';

import { nameChanged } from 'actions/myself';
import { purchaseItem } from 'actions/fate';
import Modal from 'components/Modal';
import findAskNameChangeFateCard from 'selectors/fate/findAskNameChangeFateCard';
import { Success } from 'services/BaseMonadicService';

import { IAppState } from 'types/app';

interface State {
  message?: any,
  purchaseComplete: boolean,
}

const INITIAL_STATE = {
  message: undefined,
  purchaseComplete: false,
};

export class ChangeNameModal extends Component<Props, State> {
  state = { ...INITIAL_STATE };

  handleAfterClose = () => {
    this.setState({ ...INITIAL_STATE });
  };

  handleRequestClose = () => {
    const { onRequestClose } = this.props;
    onRequestClose();
  };

  handleSubmit = async ({ name }: { name: string }, { setSubmitting }: { setSubmitting: (_: boolean) => void }) => {
    const {
      dispatch,
      fateCard,
    } = this.props;

    if (fateCard === undefined) {
      return;
    }

    const result = await dispatch(purchaseItem({ storeItemId: fateCard.id, newName: name }));
    setSubmitting(false);
    if (result instanceof Success) {
      const { characterName, message } = result.data;
      this.setState({ message, purchaseComplete: true });
      // Dispatch an action so that reducers will update
      dispatch(nameChanged(characterName));
    } else {
      const { message } = result;
      this.setState({ message });
    }
  };

  renderContent = () => {
    const { currentFate, fateCard, onRequestClose } = this.props;
    if (fateCard === undefined) {
      return null;
    }

    const cost = fateCard.price;
    const { message, purchaseComplete } = this.state;
    if (purchaseComplete) {
      return (
        <div>
          {message}
        </div>
      );
    }
    if (currentFate < cost) {
      return (
        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
          <span>
            {`Changing your name costs ${cost} Fate; you have ${currentFate}.`}
          </span>
          <Link
            onClick={onRequestClose}
            className="button button--secondary"
            to="/fate"
          >
            Buy Fate
          </Link>
        </div>
      );
    }

    return (
      <Formik
        initialValues={{
          name: '',
        }}
        onSubmit={this.handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <p>
              {`This will cost ${cost} Fate.`}
            </p>
            <Field
              type="text"
              className="form__control"
              style={{ marginBottom: '1rem' }}
              value={values.name}
              name="name"
              required
            />
            {message !== undefined && (
              <div>
                {message}
              </div>
            )}
            <div className="buttons">
              <button
                type="submit"
                disabled={isSubmitting}
                className={classnames(
                  'button button--secondary',
                  isSubmitting && 'button--disabled',
                )}
              >
                {isSubmitting ? (
                  <Loading
                    spinner
                    small
                  />
                ) : 'Change'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  };

  render = () => {
    const { isOpen } = this.props;
    const { purchaseComplete, message } = this.state;

    return (
      <Modal
        isOpen={isOpen}
        onAfterClose={this.handleAfterClose}
        onRequestClose={this.handleRequestClose}
      >
        <div>
          <h3 className="heading heading--2 heading--inverse">
            {purchaseComplete && message ? 'Success!' : 'Change your name'}
          </h3>
          {this.renderContent()}
        </div>
      </Modal>
    );
  };
}

const mapStateToProps = (state: IAppState) => ({
  currentFate: state.fate.data.currentFate,
  fateCard: findAskNameChangeFateCard(state),
});

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps> & {
  dispatch: Function, // eslint-disable-line
  isOpen: boolean,
  onRequestClose: () => void,
}

export default withRouter(connect(mapStateToProps)(ChangeNameModal));