import { useCallback, useEffect, useState } from "react";
import { webformAPI } from "../helper/apis.ts";
import { type WebformDBForexResponse } from "@scope/server";

export interface Forexes {
  IDR: number;
  JPY: number;
  SGD: number;
  USD: number;
}

export interface FrankfurterForexRates {
  IDR: number;
  JPY: number;
  SGD: number;
}

export interface FrankfurterForexAPIResponse {
  amount: number;
  base: string;
  date: string;
  rates: FrankfurterForexRates;
}

export interface UseForexResponse {
  date: string;
  rates: Forexes;
}

const EU_FOREX_API_URL =
  "https://api.frankfurter.dev/v1/latest?symbols=IDR,JPY,SGD&base=USD";

/**
 * Custom react hook that fetches forex information from the franfurter API ({@link https://api.frankfurter.dev/v1/latest?symbols=IDR,JPY,SGD&base=USD}).
 *
 * @returns The forex information, loading state, errors, and manual refetch trigger.
 */
export const useForex = (mode: "Eu" | "Db", tempDb: boolean = false) => {
  const [forexInformation, setForexInformation] = useState<
    UseForexResponse | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = mode === "Eu"
        ? await fetch(EU_FOREX_API_URL)
        : await fetch(tempDb ? webformAPI.ForexTemp : webformAPI.Forex);
      if (!response.ok) {
        throw new Error(
          `Error when fetching forex information: ${response.status} (useForex.tsx)`,
        );
      }

      if (mode === "Eu") {
        const frankfuterData: FrankfurterForexAPIResponse = await response
          .json();

        const hookData: UseForexResponse = {
          date: (new Date()).toString(),
          rates: {
            IDR: frankfuterData.rates.IDR,
            JPY: frankfuterData.rates.JPY,
            SGD: frankfuterData.rates.SGD,
            USD: frankfuterData.amount,
          },
        };

        setForexInformation(hookData);
      } else {
        const dbData: WebformDBForexResponse[] = await response.json();

        const hookData: UseForexResponse = {
          date: (new Date()).toString(),
          rates: {
            IDR: dbData.find((data) => data.Currency === "IDR")?.Valuation || 0,
            JPY: dbData.find((data) => data.Currency === "YEN")?.Valuation || 0,
            SGD: dbData.find((data) => data.Currency === "SGD")?.Valuation || 0,
            USD: dbData.find((data) => data.Currency === "USD")?.Valuation || 0,
          },
        };

        setForexInformation(hookData);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error (useForex.tsx)");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [mode]);

  return {
    forexInformation,
    isLoading,
    error,
    refetchForex: fetchData,
  };
};
export default useForex;
