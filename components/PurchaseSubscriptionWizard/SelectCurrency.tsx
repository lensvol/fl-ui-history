import { CURRENCY_CODE_GBP } from 'components/Payment/components/BraintreeView/currencyCodes';
import useIsMounted from 'hooks/useIsMounted';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import PaymentService from 'services/PaymentService';
import {
  IBraintreePlan,
  IPaymentService,
} from 'types/payment';
import Loading from 'components/Loading';
import {
  Formik,
  Form,
} from 'formik';
import Header from './Header';

interface Props {
  onCancel: () => void,
  onPlanChosen: (plan: IBraintreePlan) => void,
  onServerError: (message: string) => void,
}

export default function SelectCurrency({
  onCancel,
  onPlanChosen,
  onServerError,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<IBraintreePlan[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const isMounted = useIsMounted();

  const [selectedPlan, setSelectedPlan] = useState<IBraintreePlan | undefined>(undefined);

  useEffect(() => {
    fetchPlans();

    async function fetchPlans() {
      setLoading(true);
      const paymentService: IPaymentService = new PaymentService();
      const { data } = (await paymentService.fetchPlans());

      setPlans(data.plans);

      const gbpPlan = data.plans.find(plan => plan.currencyIsoCode === CURRENCY_CODE_GBP);
      if (gbpPlan) {
        setSelectedPlan(gbpPlan);
      } else if (data.plans.length > 0) {
        setSelectedPlan(data.plans[0]);
      }

      setLoading(false);
    }
  }, []);

  const onSelect = useCallback((evt: ChangeEvent<HTMLSelectElement>) => {
    const planId = evt.target.value;
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      return;
    }

    onServerError(`Couldn't find a plan with ID '${planId}'`);
  }, [
    plans,
    onServerError,
  ]);

  const onSubmit = useCallback(async () => {
    if (!selectedPlan) {
      onServerError('Couldn\'t find the selected plan.');
      return;
    }

    setSubmitting(true);
    await onPlanChosen(selectedPlan);
    if (isMounted.current) {
      setSubmitting(false);
    }
  }, [
    isMounted,
    onPlanChosen,
    onServerError,
    selectedPlan,
  ]);

  if (loading) {
    return <Loading spinner />;
  }

  return (
    <div>
      <Header />
      <Formik
        initialValues={{
          planId: undefined,
        }}
        onSubmit={onSubmit}
      >
        {() => (
          <Form
            className="subscription-panel"
            method="post"
            style={{
              width: '100%',
            }}
          >
            <div
              style={{
                textAlign: 'center',
              }}
            >
              <label htmlFor="planId">Choose currency: </label>
              <select
                name="planId"
                id="planId"
                style={{ border: '2px solid #666666', borderRadius: 2, marginLeft: 8 }}
                onChange={onSelect}
                value={selectedPlan?.id}
              >
                {plans.map(plan => (
                  <option
                    key={plan.id}
                    value={plan.id}
                  >
                    {plan.price}
                    {' '}
                    {plan.currencyIsoCode}
                  </option>
                ))}
              </select>
            </div>

            <div className="buttons buttons--no-squash">
              <button
                className="button button--secondary"
                disabled={loading || submitting || !selectedPlan}
                type="submit"
              >
                {submitting ? (
                  <Loading
                    spinner
                    small
                  />
                ) : (<span>Next</span>)}
              </button>
              <button
                className="button button--primary"
                type="button"
                onClick={onCancel}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}