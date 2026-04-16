import { useEffect, useState } from "react";

const usePurchasingRequests = <T, U extends { Count: number }>(
  requestUrl: string,
  requestCountUrl: string,
  queryString: string,
) => {
  const [trigger, setTrigger] = useState(0);
  const [requestIsLoading, setRequestIsLoading] = useState(false);
  const [requestIsError, setRequestIsError] = useState<Error | null>(null);
  const [totalRequestsAtDatabase, setTotalRequestsAtDatabase] = useState(0);
  const [requests, setRequests] = useState<T[]>([]);

  const refetch = () => setTrigger((prev) => prev + 1);

  useEffect(() => {
    setRequestIsLoading(true);
    setRequestIsError(null);
    const abortController = new AbortController();
    let ignore = false;

    const fetchData = async () => {
      const base = globalThis.location.origin;

      const requestUrlParameterized = new URL(requestUrl, base);
      const requestCountUrlParameterized = new URL(requestCountUrl, base);

      requestUrlParameterized.search = queryString;
      requestCountUrlParameterized.search = queryString;

      try {
        const [requestResponse, countResponse] = await Promise.all([
          fetch(requestUrlParameterized, { signal: abortController.signal }),
          fetch(requestCountUrlParameterized, {
            signal: abortController.signal,
          }),
        ]);

        if (!requestResponse.ok) {
          throw new Error(`HTTP error! status: ${requestResponse.status}`);
        }

        const requestResponseJson: T[] = await requestResponse.json();
        const countResponseJson: U[] = await countResponse
          .json();

        if (!ignore) {
          setRequests(requestResponseJson);
          if (countResponseJson && countResponseJson.length > 0) {
            setTotalRequestsAtDatabase(countResponseJson[0].Count);
          }
        }
      } catch (err) {
        if (ignore) return;
        if (err instanceof Error && err.name === "AbortError") return;

        setRequestIsError(
          new Error(
            `Encountered an error when fetching API. Please ensure your connection is stable.\n(${err}).`,
          ),
        );
      } finally {
        if (!ignore) setRequestIsLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
      abortController.abort();
    };
  }, [requestUrl, requestCountUrl, queryString, trigger]);

  return {
    requestIsLoading,
    requestIsError,
    totalRequestsAtDatabase,
    requests,
    refetch,
  };
};

export default usePurchasingRequests;
