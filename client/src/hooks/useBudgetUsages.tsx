import { useEffect, useState } from "react";
import type { BudgetUsages } from "@scope/server";
import { webformAPI } from "../helper/apis.ts";

const useBudgetUsages = (
  queryString: string,
) => {
  const [trigger, setTrigger] = useState(0);
  const [budgetUsages, setBudgetUsages] = useState<BudgetUsages[]>(
    [],
  );
  const [usagesIsLoading, setUsagesIsLoading] = useState(false);
  const [usagesIsError, setUsagesIsError] = useState<Error | null>(null);

  const refetch = () => setTrigger((prev) => prev + 1);

  useEffect(() => {
    const requestUrl = new URL(webformAPI.Usages, globalThis.location.origin);
    requestUrl.search = queryString;
    const abortController = new AbortController();
    setUsagesIsLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch(requestUrl.toString(), {
          signal: abortController.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const budgetViewRequests: BudgetUsages[] = await response.json();

        setBudgetUsages(budgetViewRequests);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setUsagesIsError(
          new Error(
            `Encountered an error when fetching API. Please ensure your connection is stable.\n(${err}).`,
          ),
        );
      } finally {
        setUsagesIsLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [queryString, trigger]);
  return { budgetUsages, usagesIsLoading, usagesIsError, refetch };
};

export default useBudgetUsages;
