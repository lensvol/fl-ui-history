import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { checkAvailability, createCharacter } from "actions/registration";
import { fetchUser } from "actions/user";

import CharacterNameContext from "components/CreateCharacter/CharacterNameContext";
import CreateCharacterComponent from "components/CreateCharacter/CreateCharacterComponent";
import ConfirmCancelCreateModal from "components/CreateCharacter/components/ConfirmCancelCreateModal";
import Loading from "components/Loading";

import { Success } from "services/BaseMonadicService";

type CreateCharacterErrors = {
  userName?: string;
};

export default function CreateCharacterContainer() {
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<CreateCharacterErrors>({});
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isConfirmCancelModalOpen, setIsConfirmCancelModalOpen] =
    useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState("");
  const [userNameIsAvailable, setUserNameIsAvailable] = useState(false);
  const [didLoad, setDidLoad] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const checkUserName = useCallback(
    async (name: string) => {
      setIsCheckingAvailability(true);

      setErrors({
        userName: undefined,
      });

      setUserNameIsAvailable(false);

      try {
        const result: any = await dispatch(checkAvailability(name));

        setIsCheckingAvailability(false);

        setErrors({
          userName: result.isSuccess
            ? undefined
            : (result.message ?? `'${name}' is taken.`),
        });

        setUserNameIsAvailable(result.isSuccess);
      } catch (e) {
        // TODO: handle actual errors
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (didLoad) {
      return;
    }

    asyncUseEffect();

    async function asyncUseEffect() {
      setDidLoad(true);

      // Fetch the user state
      setIsFetching(true);

      const result = await dispatch(fetchUser());

      if (!(result instanceof Success)) {
        return;
      }

      const {
        user: { name },
      } = result.data;

      if (!name) {
        return;
      }

      setIsFetching(false);
      setUserName(name);
      checkUserName(name);
    }
  }, [checkUserName, didLoad, dispatch, errors, userName]);

  const handleBlurName = useCallback(async () => {
    checkUserName(userName);
  }, [checkUserName, userName]);

  const handleChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    setUserNameIsAvailable(false);
  }, []);

  const handleChangeGender = useCallback((gender: string) => {
    setGender(gender);
  }, []);

  const handleCloseCancelModal = useCallback(() => {
    setIsConfirmCancelModalOpen(false);
  }, []);

  const handleRequestCancel = useCallback(() => {
    setIsConfirmCancelModalOpen(true);
  }, []);

  const handleSelectAvatar = useCallback((avatar: string) => {
    setAvatar(avatar);
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    // Send to the character-creation endpoint
    const result: any = await dispatch(
      createCharacter({ avatar, gender, userName })
    );
    const { isSuccess } = result;

    if (isSuccess) {
      history.push("/");
    }
  }, [avatar, dispatch, gender, history, userName]);

  const canSubmit = useMemo(() => {
    return !!(
      avatar !== undefined &&
      gender !== undefined &&
      userName.length &&
      userNameIsAvailable
    );
  }, [avatar, gender, userName, userNameIsAvailable]);

  if (isFetching) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          height: "100vh",
          width: "100vw",
          top: "0",
          left: "0",
        }}
      >
        <Loading spinner />
      </div>
    );
  }

  return (
    <CharacterNameContext.Provider
      value={{
        isCheckingAvailability,
        isAvailable: userNameIsAvailable,
        error: errors.userName,
        onBlur: handleBlurName,
        onChange: handleChangeName,
        value: userName,
      }}
    >
      <CreateCharacterComponent
        avatar={avatar}
        canSubmit={canSubmit}
        gender={gender}
        isSubmitting={isSubmitting}
        nameError={errors.userName}
        onChangeGender={handleChangeGender}
        onRequestCancel={handleRequestCancel}
        onSelectAvatar={handleSelectAvatar}
        onSubmit={handleSubmit}
      />
      <ConfirmCancelCreateModal
        isOpen={isConfirmCancelModalOpen}
        onRequestClose={handleCloseCancelModal}
      />
    </CharacterNameContext.Provider>
  );
}

CreateCharacterContainer.displayName = "CreateCharacterContainer";
