import { useEffect, useState } from "react";

const useFetch = <T,>(url: string, param: string = "") => {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<Error | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/${param}`, {
          signal: abortController.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseJson: T[] = await response.json();
        setData(responseJson);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const error: Error = new Error(
          `Encountered an error when fetching data from the database. Please ensure your connection is stable.\n(${err}).`,
        );
        setIsError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url, param]);

  return { data, isLoading, isError };
};

export default useFetch;
