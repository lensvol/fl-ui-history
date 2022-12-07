import { useAppSelector } from "features/app/store";
import React from "react";
import { Formik, Form, Field, FormikHelpers as FormikActions } from "formik";

import Loading from "components/Loading";

type Props = {
  onSubmit: (
    values: { username: string },
    actions: FormikActions<{ username: string }>
  ) => void;
};

export default function ChangeUsernameForm(props: Props) {
  const initialUsername = useAppSelector((state) => state.settings.data.name);

  const { onSubmit } = props;
  return (
    <Formik
      initialValues={{ username: initialUsername ?? "" }}
      onSubmit={onSubmit}
      render={({ values, errors, isSubmitting, dirty }) => (
        <div>
          <Form>
            <h2 className="media__heading heading heading--3">
              Change your username
            </h2>
            <p>What would you like your username to be?</p>
            <Field
              className="form__control"
              name="username"
              value={values.username}
            />
            {errors.username && (
              <p className="form__error">{errors.username}</p>
            )}
            <div className="buttons" style={{ marginTop: ".5rem" }}>
              <button
                className="button button--primary"
                disabled={!dirty || isSubmitting}
                type="submit"
              >
                {isSubmitting ? <Loading spinner small /> : "Submit"}
              </button>
            </div>
          </Form>
        </div>
      )}
    />
  );
}

/*
export class ChangeUsernameForm extends Component {
  render = () => {

  }
}

 */

// export default connect()(ChangeUsernameForm);
