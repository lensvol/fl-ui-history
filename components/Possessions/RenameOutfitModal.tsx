import React from 'react';
import { Field, Form, Formik } from 'formik';
import Modal from 'components/Modal';

export default function RenameOutfitModal({
  errorMessage,
  isOpen,
  onRequestClose,
  onSubmit,
}: {
  errorMessage?: string,
  isOpen: boolean,
  onRequestClose: () => void,
  onSubmit: (e: any) => Promise<void>,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <Formik
        initialValues={{ name: '' }}
        onSubmit={onSubmit}
        render={({ values }) => (
          <Form>
            <div>
              {errorMessage && (
                <p>
                  {errorMessage}
                </p>
              )}
              <Field
                type="text"
                name="name"
                value={values.name}
              />
              <button type="submit">
                Rename
              </button>
            </div>
          </Form>
        )}
      />
    </Modal>
  );
}
