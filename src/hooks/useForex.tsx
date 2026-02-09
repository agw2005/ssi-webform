import { useEffect, useState } from "react";

interface ForexRates {
  IDR: number;
  JPY: number;
  SGD: number;
}

interface ForexAPIResponse {
  amount: number;
  base: string;
  date: string;
  rates: ForexRates;
}

const FOREX_API_URL =
  "https://api.frankfurter.dev/v1/latest?symbols=IDR,JPY,SGD&base=USD";

export const useForex = () => {
  const [forexInformation, setForexInformation] =
    useState<ForexAPIResponse | null>(null);

  async function fetchForexInformation() {
    const response = await fetch(FOREX_API_URL);
    const data: ForexAPIResponse = await response.json();
    setForexInformation(data);
  }

  useEffect(() => {
    fetchForexInformation();
  }, []);

  return forexInformation;
};
export default useForex;
