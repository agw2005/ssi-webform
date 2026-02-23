import { useState } from "react";
import Primitive from "../components/reusable/Primitive.tsx";
import BudgetViewFilters from "../components/non-reusable/budget/BudgetViewFilters.tsx";
import Switch from "../components/reusable/Switch.tsx";
import BudgetView from "../components/non-reusable/budget/BudgetView.tsx";
import ReportView from "../components/non-reusable/budget/ReportView.tsx";

const COLUMNS = [
  "File Resource",
  "Dept",
  "Sec Req",
  "Nature",
  "Description",
  "Bud_01",
  "Usage01",
  "Bud_02",
  "Usage02",
  "Bud_03",
  "Usage03",
  "Bud_04",
  "Usage04",
  "Bud_05",
  "Usage05",
  "Bud_06",
  "Usage06",
  "Bud_07",
  "Usage07",
  "Bud_08",
  "Usage08",
  "Bud_09",
  "Usage09",
  "Bud_10",
  "Usage10",
  "Bud_11",
  "Usage11",
  "Bud_12",
  "Usage12",
];
const FILE_RESOURCES = ["EXIM", "FCS", "GA", "MC", "MIS"];
const PERIODS = [
  "2025LH",
  "2025FH",
  "2024LH",
  "2024FH",
  "2023LH",
  "2023FH",
  "2022LH",
  "2022FH",
  "2021LH",
  "2021FH",
  "2020LH",
  "2020FH",
];

const Budget = () => {
  const [viewMode, setViewMode] = useState<"Budget" | "Report">("Budget");
  const [fileResource, setFileResource] = useState("");
  const [period, setPeriod] = useState("");

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
            fileResources={FILE_RESOURCES}
            periods={PERIODS}
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

      {viewMode === "Budget" ? <BudgetView columns={COLUMNS} /> : ""}

      {viewMode === "Report" ? (
        <ReportView fileResources={FILE_RESOURCES} periods={PERIODS} />
      ) : (
        ""
      )}
    </Primitive>
  );
};

export default Budget;
