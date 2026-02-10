import { useCallback, useEffect, useState } from "react";

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

/**
 * Custom react hook that fetches forex information from the franfurter API ({@link https://api.frankfurter.dev/v1/latest?symbols=IDR,JPY,SGD&base=USD}).
 *
 * @returns The forex information, loading state, errors, and manual refetch trigger.
 */
export const useForex = () => {
  const [forexInformation, setForexInformation] =
    useState<ForexAPIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForexInformation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(FOREX_API_URL);
      if (!response.ok) {
        throw new Error(
          `Error when fetching forex information: ${response.status} (useForex.tsx)`,
        );
      }
      const data: ForexAPIResponse = await response.json();
      setForexInformation(data);
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
    fetchForexInformation();
  }, []);

  return {
    forexInformation,
    isLoading,
    error,
    refetchForex: fetchForexInformation,
  };
};
export default useForex;
