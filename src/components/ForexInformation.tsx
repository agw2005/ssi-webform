import { useEffect, useState } from "react";

interface ForexRates {
  IDR: number;
  JPY: number;
  SGD: number;
}

interface ForexAPIRespnse {
  amount: number;
  base: string;
  date: string;
  rates: ForexRates;
}
const FOREX_API_URL =
  "https://api.frankfurter.dev/v1/latest?symbols=IDR,JPY,SGD&base=USD";

const FOREX_RATES_STRING_FORMAT = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const ForexInformation = () => {
  const [forexInformation, setForexInformation] =
    useState<ForexAPIRespnse | null>(null);

  async function fetchForexInformation() {
    const response = await fetch(FOREX_API_URL);
    const data: ForexAPIRespnse = await response.json();
    setForexInformation(data);
  }

  useEffect(() => {
    fetchForexInformation();
  }, []);

  //   useEffect(() => {
  //     console.log(forexInformation);
  //   }, [forexInformation]);

  return (
    <>
      <div className="relative px-4 flex items-center">
        <img
          src="/flag-of-singapore.png"
          alt="singaporean flag"
          className="absolute inset-0 w-full h-full opacity-30 select-none"
        />
        <p className="z-1">
          {forexInformation?.rates.SGD.toLocaleString(
            "en-US",
            FOREX_RATES_STRING_FORMAT,
          ) + " "}
          <strong>SGD</strong>
        </p>
      </div>
      <div className="relative px-4 flex items-center">
        <img
          src="/flag-of-japan.png"
          alt="japanese flag"
          className="absolute inset-0 w-full h-full opacity-30 select-none"
        />
        <p className="z-1">
          {forexInformation?.rates.JPY.toLocaleString(
            "en-US",
            FOREX_RATES_STRING_FORMAT,
          ) + " "}
          <strong>JPY</strong>
        </p>
      </div>
      <div className="relative px-4 flex items-center">
        <img
          src="/flag-of-indonesia.png"
          alt="indonesian flag"
          className="absolute inset-0 w-full h-full opacity-30 select-none"
        />
        <p className="z-1">
          {forexInformation?.rates.IDR.toLocaleString(
            "en-US",
            FOREX_RATES_STRING_FORMAT,
          ) + " "}
          <strong>IDR</strong>
        </p>
      </div>
      <div className="relative px-4 flex items-center">
        <img
          src="/flag-of-america.png"
          alt="american flag"
          className="absolute inset-0 w-full h-full opacity-30 select-none"
        />
        <p className="z-1">
          {forexInformation?.amount.toLocaleString(
            "en-US",
            FOREX_RATES_STRING_FORMAT,
          ) + " "}
          <strong>{forexInformation?.base}</strong>
        </p>
      </div>
    </>
  );
};

export default ForexInformation;
