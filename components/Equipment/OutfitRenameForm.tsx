import React, { useMemo } from "react";
import { connect } from "react-redux";
import { Formik, Field, Form } from "formik";

import Buttonlet from "components/Buttonlet";
import { IAppState } from "types/app";

export function OutfitRenameForm({
  initialName,
  onCancel,
  onSubmit,
  outfits,
}: Props) {
  const otherOutfitNames = useMemo(
    () =>
      outfits
        .map((outfit) => outfit.name)
        .filter((name) => name !== initialName),
    [initialName, outfits]
  );

  return (
    <Formik
      initialValues={{ name: initialName }}
      onSubmit={onSubmit}
      validate={(values) => {
        const errors: { [key: string]: string } = {};
        if (otherOutfitNames.indexOf(values.name) >= 0) {
          errors.name = "Outfit names must be unique.";
        }

        return errors;
      }}
      render={({ errors, handleSubmit, values, isSubmitting }) => (
        <Form
          className="outfit-controls__outfit-rename-form"
          style={{ position: "relative" }}
        >
          <Field
            autoFocus
            className="form__control outfit-controls__outfit-rename-field"
            maxLength={21}
            name="name"
            value={values.name}
          />
          {errors.name && (
            <div className="outfit-controls__outfit-rename-form-error">
              {errors.name}
            </div>
          )}
          <Buttonlet
            type={isSubmitting ? "refresh" : "check"}
            onClick={handleSubmit}
            disabled={isSubmitting || errors.name !== undefined}
            spin={isSubmitting}
            style={{
              minWidth: "32px",
            }}
          />
          <Buttonlet
            type="delete"
            onClick={onCancel}
            style={{
              minWidth: "32px",
            }}
          />
        </Form>
      )}
    />
  );
}

const mapStateToProps = (state: IAppState) => ({
  outfits: state.myself.character.outfits,
});

type OwnProps = {
  initialName: string;
  onCancel: () => void;
  onSubmit: (v: { name: string }) => void;
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(OutfitRenameForm);
