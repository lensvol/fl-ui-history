import { CURRENCY_CODE_GBP } from "constants/payment";
import useIsMounted from "hooks/useIsMounted";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import PaymentService from "services/PaymentService";
import {
  IBraintreeAddOn,
  IBraintreePlan,
  IPaymentService,
} from "types/payment";
import Loading from "components/Loading";
import { Formik, Form } from "formik";
import Header from "./Header";
import { useFeature } from "flagged";
import { FEATURE_ENHANCED_EF } from "features/feature-flags";

import { PremiumSubscriptionType } from "types/subscription";

interface Props {
  hasSubscription: boolean;
  onCancel: () => void;
  onPlanChosen: (plan: IBraintreePlan, addOn?: IBraintreeAddOn) => void;
  onServerError: (message: string) => void;
  renewDate?: string;
  subscriptionType?: PremiumSubscriptionType;
}

export default function SelectCurrency({
  hasSubscription,
  onCancel,
  onPlanChosen,
  onServerError,
  renewDate,
  subscriptionType,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<IBraintreePlan[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<IBraintreePlan | undefined>(
    undefined
  );
  const [selectedAddOn, setSelectedAddOn] = useState<
    IBraintreeAddOn | undefined
  >(undefined);
  const [isEnhanced, setIsEnhanced] = useState(false);

  const isMounted = useIsMounted();
  const supportsEnhancedEF = useFeature(FEATURE_ENHANCED_EF);

  useEffect(() => {
    fetchPlans();

    async function fetchPlans() {
      setLoading(true);

      const paymentService: IPaymentService = new PaymentService();
      const { data } = await paymentService.fetchPlans();

      setPlans(data.plans);

      const gbpPlan = data.plans.find(
        (plan) => plan.currencyIsoCode === CURRENCY_CODE_GBP
      );

      if (gbpPlan) {
        setSelectedPlan(gbpPlan);
      } else if (data.plans.length > 0) {
        setSelectedPlan(data.plans[0]);
      }

      setSelectedAddOn(undefined);
      setLoading(false);
    }
  }, [setSelectedAddOn]);

  const onCurrencySelect = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      if (!supportsEnhancedEF) {
        const planId = evt.target.value;
        const plan = plans.find((p) => p.id === planId);

        if (!plan) {
          onServerError(`Couldn't find a plan with ID '${planId}'`);

          return;
        }

        setSelectedPlan(plan);

        return;
      }

      const currencyIsoCode = evt.target.value;
      const plan = plans.find((p) => p.currencyIsoCode === currencyIsoCode);

      if (!plan) {
        onServerError(
          `Couldn't find a plan denominated in '${currencyIsoCode}'`
        );

        return;
      }

      setSelectedPlan(plan);
      setSelectedAddOn(undefined);
      setIsEnhanced(false);
    },
    [plans, onServerError, supportsEnhancedEF]
  );

  const onPlanSelect = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      if (!supportsEnhancedEF) {
        return;
      }

      const planId = evt.target.value.split("_")[0];
      const plan = plans.find((p) => p.id === planId);

      if (!plan) {
        onServerError(`Couldn't find a plan with ID '${planId}'`);

        return;
      }

      setSelectedPlan(plan);

      const addOnId = evt.target.value.split("_")[1];
      const addOn = plan.addOns?.find((a) => a.id === addOnId);

      setSelectedAddOn(addOn);
      setIsEnhanced(!!addOn);
    },
    [plans, onServerError, supportsEnhancedEF]
  );

  const onSubmit = useCallback(async () => {
    if (!selectedPlan) {
      onServerError("Couldn't find the selected plan.");

      return;
    }

    setSubmitting(true);

    await onPlanChosen(selectedPlan, selectedAddOn);

    if (isMounted.current) {
      setSubmitting(false);
    }
  }, [isMounted, onPlanChosen, onServerError, selectedAddOn, selectedPlan]);

  if (loading) {
    return <Loading spinner />;
  }

  if (!supportsEnhancedEF) {
    return (
      <div>
        <Header
          hasSubscription={hasSubscription}
          isEnhanced={false}
          renewDate={renewDate}
          subscriptionType={subscriptionType}
        />
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
                width: "100%",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <label htmlFor="planId">Choose currency: </label>
                <select
                  name="planId"
                  id="planId"
                  style={{
                    border: "2px solid #666",
                    borderRadius: 2,
                    marginLeft: 8,
                  }}
                  onChange={onCurrencySelect}
                  value={selectedPlan?.id}
                >
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.price} {plan.currencyIsoCode}
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
                  {submitting ? <Loading spinner small /> : <span>Next</span>}
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

  return (
    <div>
      <Header
        hasSubscription={hasSubscription}
        isEnhanced={isEnhanced}
        renewDate={renewDate}
        subscriptionType={subscriptionType}
      />
      <Formik
        initialValues={{
          planId: undefined,
        }}
        onSubmit={onSubmit}
      >
        {() => (
          <Form className="ef-subscription-panel" method="post">
            <div
              className="ef-subscription-options"
              style={{
                rowGap: "1rem",
              }}
            >
              <label htmlFor="currencyIsoCode">Choose currency</label>
              <div className="ef-subscription-detail">
                <select
                  name="currencyIsoCode"
                  id="currencyIsoCode"
                  onChange={onCurrencySelect}
                  value={selectedPlan?.currencyIsoCode}
                >
                  {plans.map((plan) => (
                    <option
                      key={plan.currencyIsoCode}
                      value={plan.currencyIsoCode}
                    >
                      {plan.currencyIsoCode}
                    </option>
                  ))}
                </select>
              </div>

              <label htmlFor="planId">Choose subscription type</label>
              <div className="ef-subscription-detail">
                <select
                  name="planId"
                  id="planId"
                  onChange={onPlanSelect}
                  value={selectedPlan?.id + "_" + selectedAddOn?.id}
                >
                  {plans
                    .filter(
                      (plan) =>
                        plan.currencyIsoCode === selectedPlan?.currencyIsoCode
                    )
                    .map((plan) => (
                      <>
                        <option
                          key={plan.id + "_undefined"}
                          value={plan.id + "_undefined"}
                        >
                          Standard Subscription: {plan.price}{" "}
                          {plan.currencyIsoCode}
                        </option>
                        <option
                          key={plan.id + "_" + plan.addOns?.[0]?.id}
                          value={plan.id + "_" + plan.addOns?.[0]?.id}
                        >
                          Enhanced Subscription:{" "}
                          {plan.price + (plan.addOns?.[0]?.amount ?? 0)}{" "}
                          {plan.currencyIsoCode}
                        </option>
                      </>
                    ))}
                </select>
              </div>
            </div>

            <div
              className="buttons buttons--no-squash"
              style={{
                marginTop: "1rem",
              }}
            >
              <button
                className="button button--secondary"
                disabled={loading || submitting || !selectedPlan}
                type="submit"
              >
                {submitting ? <Loading spinner small /> : <span>Next</span>}
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
