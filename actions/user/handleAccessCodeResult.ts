import { displayAccessCodeResult } from 'actions/accessCodes';
import { Dispatch } from 'redux';

export default function handleAccessCodeResult({ accessCodeResult: result }: { accessCodeResult?: any | undefined }) {
  return (dispatch: Dispatch) => {
    if (result) {
      dispatch(displayAccessCodeResult(result));
    }
  };
}