import { useState } from "react";
import Primitive from "../components/reusable/Primitive.tsx";
import BudgetViewFilters from "../components/non-reusable/budget/BudgetViewFilters.tsx";
import Switch from "../components/reusable/Switch.tsx";
import BudgetView from "../components/non-reusable/budget/BudgetView.tsx";
import ReportView from "../components/non-reusable/budget/ReportView.tsx";
import type { FileResource, Period, Year } from "@scope/server";
import useFetch from "../hooks/useFetch.tsx";
import fileResourceFetchHandler from "../helper/fileResourceFetchHandler.ts";
import { webformAPI } from "../helper/apis.ts";

const Budget = () => {
  const [viewMode, setViewMode] = useState<"Budget" | "Report">("Budget");
  const [fileResource, setFileResource] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));

  const {
    data: fileResources,
    isLoading: isFileResourcesLoading,
    isError: isFileResourcesError,
  } = useFetch<FileResource>(webformAPI.FileResources);

  const {
    data: years,
    isLoading: isYearsLoading,
    isError: isYearsError,
  } = useFetch<Year>(webformAPI.BudgetYears);

  const {
    data: periods,
    isLoading: isPeriodsLoading,
    isError: isPeriodsError,
  } = useFetch<Period>(webformAPI.BudgetPeriods);

  return (
    <Primitive
      isLoading={[isFileResourcesLoading, isYearsLoading, isPeriodsLoading]}
      isErr={[isFileResourcesError, isYearsError, isPeriodsError]}
      componentName="Budget.tsx"
      pageTitle="Budget"
    >
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
        {viewMode === "Budget"
          ? (
            <BudgetViewFilters
              variants="black"
              fileResources={fileResourceFetchHandler(fileResources)}
              years={(!years ? [] : [
                ...years.map((year) => year.Year),
                String(
                  Math.max(...years.map((year) => Number(year.Year))) + 1,
                ),
              ]).sort()}
              fileResourceValue={fileResource}
              yearValue={year}
              fileResourceOnChange={(e) => {
                setFileResource(e.currentTarget.value);
              }}
              yearOnChange={(e) => {
                setYear(e.currentTarget.value);
              }}
            />
          )
          : (
            ""
          )}
      </div>

      {viewMode === "Budget"
        ? <BudgetView year={year} fileResource={fileResource} />
        : (
          ""
        )}

      {viewMode === "Report"
        ? (
          <ReportView
            fileResources={!fileResources
              ? []
              : fileResources.map((budget) => budget.FileResource)}
            periods={!periods ? [] : periods.map((period) => period.Period)}
          />
        )
        : (
          ""
        )}
    </Primitive>
  );
};

export default Budget;
