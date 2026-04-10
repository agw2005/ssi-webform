import { useEffect, useState } from "react";
import serverDomain from "../helper/serverDomain.ts";
import type { BudgetViewAtYear } from "@scope/server-mysql";

const BUDGET_VIEW_URL = `${serverDomain}/budget`;

const useBudgets = (
  year: string,
  fileResource: string,
  queryString: string,
) => {
  const [trigger, setTrigger] = useState(0);
  const [budgetIsLoading, setBudgetIsLoading] = useState(false);
  const [budgetIsError, setBudgetIsError] = useState<Error | null>(null);
  const [budgets, setBudgets] = useState<BudgetViewAtYear[]>([]);

  const refetch = () => setTrigger((prev) => prev + 1);

  useEffect(() => {
    const requestUrl = new URL(BUDGET_VIEW_URL);
    requestUrl.search = queryString;
    const abortController = new AbortController();
    setBudgetIsError(null);
    setBudgetIsLoading(true);

    const fetchData = async () => {
      try {
        const budgetViewResponse = await fetch(requestUrl.toString(), {
          signal: abortController.signal,
        });
        if (!budgetViewResponse.ok) {
          throw new Error(`HTTP error! status: ${budgetViewResponse.status}`);
        }

        const budgetViewResponseJson: BudgetViewAtYear[] =
          await budgetViewResponse.json();

        setBudgets(budgetViewResponseJson);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const error: Error = new Error(
          `Encountered an error when fetching API. Please ensure your connection is stable.\n(${err}).`,
        );
        setBudgetIsError(error);
      } finally {
        setBudgetIsLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [year, fileResource, queryString, trigger]);

  return { budgets, budgetIsLoading, budgetIsError, refetch };
};

export default useBudgets;
