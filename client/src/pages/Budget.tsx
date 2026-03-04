import { useState } from "react";
import Primitive from "../components/reusable/Primitive.tsx";
import BudgetViewFilters from "../components/non-reusable/budget/BudgetViewFilters.tsx";
import Switch from "../components/reusable/Switch.tsx";
import BudgetView from "../components/non-reusable/budget/BudgetView.tsx";
import ReportView from "../components/non-reusable/budget/ReportView.tsx";
import LoadingFallback from "../components/reusable/LoadingFallback.tsx";
import type { FileResource, Period } from "@scope/server";
import useFetch from "../hooks/useFetch.tsx";
import fileResourceFetchHandler from "../helper/fileResourceFetchHandler.ts";

const FILE_RESOURCES_URL = "http://localhost:8000/budget/fileresources";
const PERIODS_URL = "http://localhost:8000/budget/periods";

const Budget = () => {
  const [viewMode, setViewMode] = useState<"Budget" | "Report">("Budget");
  const [fileResource, setFileResource] = useState("");
  const [period, setPeriod] = useState("");

  const {
    data: fileResources,
    isLoading: isFileResourcesLoading,
    isError: isFileResourcesError,
  } = useFetch<FileResource>(FILE_RESOURCES_URL);

  const {
    data: periods,
    isLoading: isPeriodsLoading,
    isError: isPeriodsError,
  } = useFetch<Period>(PERIODS_URL);

  if (isFileResourcesLoading && isPeriodsLoading) {
    return <LoadingFallback />;
  }

  if (isFileResourcesError && isPeriodsError) {
    return (
      <div className="m-4">
        <div>Something unexpected happened.</div>
        {isFileResourcesError ? isFileResourcesError.message : ""}
        {isPeriodsError ? isPeriodsError.message : ""}
      </div>
    );
  }

  return (
    <Primitive>
      <div className="flex gap-2 w-max">
        <Switch
          id="budget-report-view-switch"
          variant="black"
          onValue="Report"
          offValue="Budget"
          onLabel="View Report"
          offLabel="View Budget"
          setter={setViewMode}
          getter={viewMode}
        />
        {viewMode === "Budget" ? (
          <BudgetViewFilters
            variants="black"
            fileResources={fileResourceFetchHandler(fileResources)}
            periods={!periods ? [] : periods.map((period) => period.Period)}
            fileResourceValue={fileResource}
            periodValue={period}
            fileResourceOnChange={(e) => {
              setFileResource(e.currentTarget.value);
            }}
            periodOnChange={(e) => {
              setPeriod(e.currentTarget.value);
            }}
          />
        ) : (
          ""
        )}
      </div>

      {viewMode === "Budget" ? (
        <BudgetView periode={period} fileResource={fileResource} />
      ) : (
        ""
      )}

      {viewMode === "Report" ? (
        <ReportView
          fileResources={
            !fileResources
              ? []
              : fileResources.map((budget) => budget.FileResource)
          }
          periods={!periods ? [] : periods.map((period) => period.Period)}
        />
      ) : (
        ""
      )}
    </Primitive>
  );
};

export default Budget;
