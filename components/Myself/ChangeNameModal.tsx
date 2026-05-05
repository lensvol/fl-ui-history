import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import classnames from "classnames";

import { Field, Form, Formik } from "formik";

import { purchaseItem } from "actions/fate";
import { nameChanged } from "actions/myself";

import Loading from "components/Loading";
import Modal from "components/Modal";

import { useAppSelector } from "features/app/store";

import { Success } from "services/BaseMonadicService";
import findAskNameChangeFateCard from "selectors/fate/findAskNameChangeFateCard";

type Props = {
  isFree?: boolean;
  isOpen: boolean;
  onRequestClose: () => void;
};

export default function ChangeNameModal({
  isFree,
  isOpen,
  onRequestClose,
}: Props) {
  const currentFate = useAppSelector((state) => state.fate.data.currentFate);
  const fateCard = useAppSelector((state) => findAskNameChangeFateCard(state));

  const dispatch: Function = useDispatch();

  const [message, setMessage] = useState<string | undefined>(undefined);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const handleAfterClose = useCallback(() => {
    setMessage(undefined);
    setPurchaseComplete(false);
  }, []);

  const handleRequestClose = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  const handleSubmit = useCallback(
    async (
      { name }: { name: string },
      { setSubmitting }: { setSubmitting: (_: boolean) => void }
    ) => {
      if (fateCard === undefined) {
        return;
      }

      const result = await dispatch(
        purchaseItem({
          storeItemId: fateCard.id,
          newName: name,
          isFree,
        })
      );

      setSubmitting(false);

      if (result instanceof Success) {
        const { characterName, message } = result.data;

        setMessage(message);
        setPurchaseComplete(true);

        // Dispatch an action so that reducers will update
        dispatch(nameChanged(characterName));
      } else {
        const { message } = result;

        setMessage(message);
      }
    },
    [dispatch, fateCard, isFree]
  );

  const title = useMemo(() => {
    if (purchaseComplete && message !== undefined) {
      return "Success!";
    }

    return "Change your name";
  }, [message, purchaseComplete]);

  const cost = useMemo(() => {
    if (fateCard === undefined) {
      return 0;
    }

    return fateCard.price;
  }, [fateCard]);

  const canChangeName = useMemo(() => {
    return isFree || currentFate >= cost;
  }, [cost, currentFate, isFree]);

  return (
    <Modal
      isOpen={isOpen}
      onAfterClose={handleAfterClose}
      onRequestClose={handleRequestClose}
    >
      <div>
        <h3 className="heading heading--2 heading--inverse">{title}</h3>
        {fateCard !== undefined &&
          (purchaseComplete ? (
            <div>{message}</div>
          ) : canChangeName ? (
            <Formik
              initialValues={{
                name: "",
              }}
              onSubmit={handleSubmit}
            >
              {({ values, isSubmitting }) => (
                <Form>
                  {!isFree && <p>{`This will cost ${cost} Fate.`}</p>}

                  <Field
                    type="text"
                    className="form__control"
                    style={{
                      marginBottom: "1rem",
                    }}
                    value={values.name}
                    name="name"
                    required
                  />

                  {message !== undefined && <div>{message}</div>}

                  <div className="buttons">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={classnames(
                        "button button--secondary",
                        isSubmitting && "button--disabled"
                      )}
                    >
                      {isSubmitting ? <Loading spinner small /> : "Change"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <div
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{`Changing your name costs ${cost} Fate; you have ${currentFate}.`}</span>
              <Link
                onClick={onRequestClose}
                className="button button--secondary"
                to="/fate"
              >
                Buy Fate
              </Link>
            </div>
          ))}
      </div>
    </Modal>
  );
}

ChangeNameModal.displayName = "ChangeNameModal";
