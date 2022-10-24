import { CURRENCY_CODE_GBP } from "components/Payment/components/BraintreeView/currencyCodes";
import CurrencySelector from "components/Payment/components/CurrencySelector";
import MediaLgDown from "components/Responsive/MediaLgDown";
import MediaXlUp from "components/Responsive/MediaXlUp";
import useIsMounted from "hooks/useIsMounted";
import React, { ChangeEvent, useCallback, useState, useEffect } from "react";
import {
  CurrencyCode,
  IBraintreeNexOptionsResponse,
  IPaymentService,
  NexQuantity,
} from "types/payment";
import PaymentService from "services/PaymentService";
import Loading from "components/Loading";
import VatToggle from "./VatToggle";
import Packages from "./Packages";

interface Props {
  onCancel: () => void;
  onNext: (pkg: NexQuantity, options: IBraintreeNexOptionsResponse) => void;
}

export default function ChooseFateAmountAndCurrency({
  onCancel,
  onNext,
}: Props) {
  const isMounted = useIsMounted();

  const [options, setOptions] = useState<
    IBraintreeNexOptionsResponse | undefined
  >(undefined);

  const [isSelectingCurrency, setIsSelectingCurrency] = useState(false);
  const [isBreakdownVisible, setIsBreakdownVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<
    NexQuantity | undefined
  >(undefined);

  const handleClickNext = useCallback(() => {
    if (!selectedPackage || !options) {
      return;
    }

    onNext(selectedPackage, options);
  }, [onNext, options, selectedPackage]);

  const fetchNexOptions = useCallback(
    async (code?: CurrencyCode) => {
      const paymentService: IPaymentService = new PaymentService();
      const { data } = await paymentService.selectCurrency(
        code ?? CURRENCY_CODE_GBP
      );
      if (isMounted.current) {
        setOptions(data);
      }
    },
    [isMounted]
  );

  const handleSelectCurrency = useCallback(
    async (evt: ChangeEvent<HTMLSelectElement>) => {
      const {
        target: { value },
      } = evt;
      setIsSelectingCurrency(true);
      await fetchNexOptions(value as CurrencyCode);
      if (isMounted.current) {
        setIsSelectingCurrency(false);
      }
    },
    [fetchNexOptions, isMounted]
  );

  const onTogglePriceBreakdown = useCallback(() => {
    setIsBreakdownVisible(!isBreakdownVisible);
  }, [isBreakdownVisible]);

  const handleSelectPackage = useCallback((newSelectedPackage: NexQuantity) => {
    setSelectedPackage(newSelectedPackage);
  }, []);

  useEffect(() => {
    fetchNexOptions();
  }, [fetchNexOptions]);

  if (isSelectingCurrency || !options) {
    return <Loading spinner />;
  }

  return (
    <>
      <h2 className="heading heading--2 heading--inverse">
        Select Fate quantity
      </h2>
      <div className="nex-amount">
        <label htmlFor="currency" style={{ fontWeight: "bold" }}>
          Currency
        </label>
        <CurrencySelector
          value={options.currencyCode}
          onChange={handleSelectCurrency}
        />
        <ul className="nex-amount__list" id="nex-amount-list">
          <Packages
            isBreakdownVisible={isBreakdownVisible}
            isFetching={isSelectingCurrency}
            onSelect={handleSelectPackage}
            packages={options.packages}
            selectedPackage={selectedPackage}
          />
        </ul>
        <MediaLgDown>
          <VatToggle onToggle={onTogglePriceBreakdown} />
        </MediaLgDown>
      </div>
      <div className="buttons buttons--no-squash">
        <button
          className="button button--secondary"
          type="button"
          onClick={handleClickNext}
          disabled={!(options && selectedPackage)}
        >
          Next
        </button>
        <button
          className="button button--primary"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
      <MediaXlUp>
        <VatToggle onToggle={onTogglePriceBreakdown} />
      </MediaXlUp>
    </>
  );
}
