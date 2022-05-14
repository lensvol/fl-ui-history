import React from 'react';

import CharacterNameContext from 'components/CreateCharacter/CharacterNameContext';

export default function NameForm() {
  return (
    <CharacterNameContext.Consumer>
      {({
        error,
        isAvailable,
        isCheckingAvailability,
        onBlur,
        onChange,
        value,
      }) => (
        <p className="form__group">
          <label className="heading heading--3" htmlFor="userName">
            Choose a character name
          </label>
          <input
            className="form__control"
            disabled={isCheckingAvailability}
            name="userName"
            type="text"
            onBlur={onBlur}
            onChange={onChange}
            value={value}
            required
          />
          {isAvailable && value.length > 0 && (
            <span>
              {`${value} is available!`}
            </span>
          )}
          {error && (
            <span className="form__error">
              {error}
            </span>
          )}
        </p>
      )}
    </CharacterNameContext.Consumer>
  );
}

NameForm.displayName = 'NameForm';
