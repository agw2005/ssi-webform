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
  const [rates, setRates] = useState<ForexAPIResponse | null>(null);

  useEffect(() => {
    async function fetchForex() {
      const res = await fetch(FOREX_API_URL);
      const data: ForexAPIResponse = await res.json();
      setRates(data);
    }

    fetchForex();
  }, []);

  return rates;
};
export default useForex;