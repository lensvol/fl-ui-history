import { OUTFIT_PURCHASE } from 'constants/fate';
import React, {
  useCallback, useMemo,
  useState,
} from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Formik, Form, Field } from 'formik';

import Loading from 'components/Loading';
import { fetchMyself } from 'actions/myself';
import { changeOutfit, renameOutfit } from 'actions/outfit';
import { ThunkDispatch } from 'redux-thunk';
import { Success } from 'services/BaseMonadicService';
import { IAppState } from 'types/app';
import { IOutfit } from 'types/outfit';

export function PurchaseOutfitSuccess({
  dispatch,
  fateCards,
  initialName,
  onFinishedRenaming,
  outfits,
}: Props) {
  const [isRenaming, setIsRenaming] = useState(false);

  const fateCard = useMemo(() => fateCards.find(fc => fc.action === OUTFIT_PURCHASE), [fateCards]);

  const onSubmit = useCallback(async ({ name }: { name: string }) => {
    // Whether or not we renamed, submit the data
    setIsRenaming(true);
    // We definitely have this because that was the name on mount
    const outfitId = outfits.find(o => o.name === initialName)?.id;

    if (!outfitId) {
      console.error(`Failed to find an outfit with name '${initialName}'`);
      onFinishedRenaming();
      return;
    }

    await dispatch(renameOutfit(outfitId, name));

    // Find the new outfit we just created and equip it
    const result = await dispatch(fetchMyself());
    if (result instanceof Success) {
      const { data } = result;
      const newOutfit = data.character.outfits.find((o: IOutfit) => o.name === name);
      if (newOutfit) {
        await dispatch(changeOutfit(newOutfit.id));
      }
    }

    onFinishedRenaming();
  }, [
    dispatch,
    initialName,
    onFinishedRenaming,
    outfits,
  ]);

  // TODO(sdob) if purchase succeeded, but the fate card has disappeared, how should we handle this?
  if (!fateCard) {
    return null;
  }

  return (
    <>
      <h1
        className={classnames('purchase-outfit-slot-modal__header')}
      >
        Purchase Success!
      </h1>
      <p>
        You spent
        {' '}
        {fateCard.price}
        {' '}
        Fate... And thank you! It's folk like you who keep the game running.
      </p>
      <p>
        Choose a name for your new outfit:
      </p>
      <Formik
        onSubmit={onSubmit}
        initialValues={{ name: initialName }}
        render={({ values }) => (
          <Form className="purchase-outfit-success-form">
            <Field
              name="name"
              value={values.name}
              className="form__control purchase-outfit-success-form__input"
            />
            <button
              className="button button--primary purchase-outfit-success-form__button"
              disabled={isRenaming}
              type="submit"
            >
              {isRenaming ? <Loading spinner small /> : <span>Name</span>}
            </button>
          </Form>
        )}
      />
    </>
  );
}

const mapStateToProps = (state: IAppState) => ({
  fateCards: state.fate.data.fateCards,
  outfits: state.myself.character.outfits,
});

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: ThunkDispatch<any, any, any>,
  initialName: string,
  onFinishedRenaming: () => void,
};

export default connect(mapStateToProps)(PurchaseOutfitSuccess);