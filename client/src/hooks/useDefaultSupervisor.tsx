import { useEffect, useState } from "react";
import { webformAPI } from "../helper/apis.ts";
import { SupervisorNames } from "@scope/server-ssms";

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

    console.log(url);
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          signal: abortController.signal,
          cache: "no-cache",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(supervisorNRPs),
        });
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseJson: SupervisorNames[] = await response.json();
        setSupervisors(
          responseJson.map((supervisor) => supervisor.NameUser),
        );
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
