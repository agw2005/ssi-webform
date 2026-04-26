import { useEffect, useState } from "react";
import { webformAPI } from "../helper/apis.ts";
import type { SupervisorNames } from "@scope/server";

const useDefaultSupervisor = (
  supervisorNRPs: string[],
) => {
  const url = webformAPI.SupervisorNrp;

  const [supervisors, setSupervisors] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<Error | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = () => {
    setTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const abortController = new AbortController();
    setIsLoading(true);

    const fetchData = async () => {
      try {
        for (const supervisorNrp of supervisorNRPs) {
          const response = await fetch(`${url}/${supervisorNrp}`, {
            signal: abortController.signal,
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const responseJson: SupervisorNames[] = await response.json();
          const newNames = responseJson.map((supervisor) =>
            supervisor.NameUser
          );

          setSupervisors((prev) => [
            ...(prev ?? []),
            ...newNames,
          ]);
        }
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
  }, [url, trigger, supervisorNRPs]);

  return { supervisors, isLoading, isError, refetch };
};

export default useDefaultSupervisor;
