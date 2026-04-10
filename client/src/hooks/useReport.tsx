import { useEffect, useState } from "react";
import serverDomain from "../helper/serverDomain.ts";
import type { ReportResponse } from "@scope/server-mysql";

const REPORT_URL = `${serverDomain}/budget/report`;

const useReport = (
  reportType: "" | "general" | "byquarter" | "bysection" | "bynature" | "empty",
  queryString: string,
) => {
  const [trigger, setTrigger] = useState(0);
  const [reportData, setReportData] = useState<ReportResponse[] | null>(null);
  const [isReportDataLoading, setIsReportDataLoading] = useState(false);
  const [isReportDataError, setIsReportDataError] = useState<Error | null>(
    null,
  );

  const refetch = () => setTrigger((prev) => prev + 1);

  useEffect(() => {
    setIsReportDataLoading(true);
    setIsReportDataError(null);
    const abortController = new AbortController();
    let ignore = false;

    const fetchData = async () => {
      const requestUrl = new URL(REPORT_URL);
      requestUrl.search = queryString;

      try {
        const reportResponse = await fetch(requestUrl, {
          signal: abortController.signal,
        });
        if (!reportResponse.ok) {
          throw new Error(`HTTP error! status: ${reportResponse.status}`);
        }

        const reportResponseJson: ReportResponse[] = await reportResponse
          .json();

        if (!ignore) setReportData(reportResponseJson);
      } catch (err) {
        if (ignore) return;
        if (err instanceof Error && err.name === "AbortError") return;

        setIsReportDataError(
          new Error(
            `Encountered an error when fetching API. Please ensure your connection is stable.\n(${err}).`,
          ),
        );
      } finally {
        if (!ignore) setIsReportDataLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
      abortController.abort();
    };
  }, [reportType, queryString, trigger]);

  return { reportData, isReportDataLoading, isReportDataError, refetch };
};

export default useReport;
