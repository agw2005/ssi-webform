import { Link } from "react-router-dom";
import { useReducer } from "react";
import getCurrentPeriod from "../../../helper/getCurrentPeriod.ts";

interface ReportViewProps {
  fileResources: string[];
  periods: string[];
}

interface Selection {
  general: { fileResource: string; period: string };
  byQuarter: { month: string; fileResource: string };
  bySection: { period: string };
  byNature: { period: string };
}

type SelectionAction =
  | { type: "UPDATE_GENERAL"; field: keyof Selection["general"]; value: string }
  | {
      type: "UPDATE_QUARTER";
      field: keyof Selection["byQuarter"];
      value: string;
    }
  | { type: "UPDATE_SECTION"; value: string }
  | { type: "UPDATE_NATURE"; value: string };

const DEFAULT_OPTIONS_SELECTION: Selection = {
  general: {
    fileResource: "Show All",
    period: getCurrentPeriod().substring(0, 6),
  },
  byQuarter: {
    month: new Date().toISOString().substring(0, 7),
    fileResource: "ACC",
  },
  bySection: { period: getCurrentPeriod().substring(0, 6) },
  byNature: { period: getCurrentPeriod().substring(0, 6) },
};

const optionReducer = (state: Selection, action: SelectionAction) => {
  switch (action.type) {
    case "UPDATE_GENERAL":
      return {
        ...state,
        general: { ...state.general, [action.field]: action.value },
      };
    case "UPDATE_QUARTER":
      return {
        ...state,
        byQuarter: { ...state.byQuarter, [action.field]: action.value },
      };
    case "UPDATE_SECTION":
      return {
        ...state,
        bySection: { ...state.bySection, period: action.value },
      };
    case "UPDATE_NATURE":
      return {
        ...state,
        byNature: { ...state.byNature, period: action.value },
      };
    default:
      return state;
  }
};

const ReportView = ({ fileResources, periods }: ReportViewProps) => {
  const [options, setOptions] = useReducer(
    optionReducer,
    DEFAULT_OPTIONS_SELECTION,
  );

  return (
    <div className="mt-4 flex gap-4 flex-wrap">
      <div className="flex flex-col p-8 bg-gray-100 rounded-2xl items-start flex-1 justify-between">
        <div className="flex flex-col gap-4 items-start">
          <h2 className="text-3xl font-bold text-gray-600">General Report</h2>
          <div className="text-xs tracking-wide bg-gray-600 text-white p-2 rounded-lg">
            Budget Table
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-end">
            <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-gray-600 bg-gray-600 text-white select-none">
              File Resource
            </div>
            <select
              name="general-report-file-resource"
              id="general-report-file-resource"
              className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-gray-600 text-gray-600 bg-white outline-none"
              onChange={(e) => {
                setOptions({
                  type: "UPDATE_GENERAL",
                  field: "fileResource",
                  value: e.target.value,
                });
              }}
              value={options.general.fileResource}
            >
              <option value="Show All">Show All</option>
              {fileResources.map((option, index) => {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-end">
            <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-gray-600 bg-gray-600 text-white select-none">
              Period
            </div>
            <select
              name="general-report-period"
              id="general-report-period"
              className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-gray-600 text-gray-600 bg-white outline-none"
              onChange={(e) => {
                setOptions({
                  type: "UPDATE_GENERAL",
                  field: "period",
                  value: e.target.value,
                });
              }}
              value={options.general.period}
            >
              {periods.map((option, index) => {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <Link
          className="mt-4 xl:mt-8 | hover:shadow-xl | bg-black/5 hover:bg-black/25 active:bg-white | active:text-black | shadow-md self-center px-4 py-2 border rounded-4xl select-none"
          to={`/report?type=general&fileresource=${options.general.fileResource}&period=${options.general.period}`}
          target="_blank"
        >
          Show Report
        </Link>
      </div>

      <div className="flex flex-col p-8 bg-yellow-100 rounded-2xl items-start flex-1 justify-between">
        <div className="flex flex-col gap-4 items-start">
          <h2 className="text-3xl font-bold text-yellow-600">
            Report by Quarter
          </h2>
          <div className="text-xs tracking-wide bg-yellow-600 text-white p-2 rounded-lg">
            Summary Budget
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-end">
            <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              Month
            </div>
            <input
              type="month"
              name="month"
              id="month"
              className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl text-center border border-yellow-600 text-yellow-600 bg-white outline-none"
              onChange={(e) => {
                setOptions({
                  type: "UPDATE_QUARTER",
                  field: "month",
                  value: e.target.value,
                });
              }}
              value={options.byQuarter.month}
            />
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-end">
            <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              File Resource
            </div>
            <select
              name="report-by-quarter-file-resource"
              id="report-by-quarter-file-resource"
              className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-yellow-600 text-yellow-600 bg-white outline-none"
              onChange={(e) => {
                setOptions({
                  type: "UPDATE_QUARTER",
                  field: "fileResource",
                  value: e.target.value,
                });
              }}
              value={options.byQuarter.fileResource}
            >
              {fileResources.map((option, index) => {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        {options.byQuarter.month === "" ? (
          <div className="mt-4 xl:mt-8 | hover:shadow-xl | bg-black/5 hover:bg-black/25 active:bg-white | active:text-black | shadow-md self-center px-4 py-2 border rounded-4xl select-none">
            Show Report
          </div>
        ) : (
          <Link
            className="mt-4 xl:mt-8 | hover:shadow-xl | bg-black/5 hover:bg-black/25 active:bg-white | active:text-black | shadow-md self-center px-4 py-2 border rounded-4xl select-none"
            to={`/report?type=byquarter&month=${options.byQuarter.month}&fileresource=${options.byQuarter.fileResource}`}
            target="_blank"
          >
            Show Report
          </Link>
        )}
      </div>

      <div className="flex flex-col p-8 bg-blue-100 rounded-2xl items-start flex-1 justify-between">
        <div className="flex flex-col gap-4 items-start">
          <h2 className="text-3xl font-bold text-blue-600">
            Report by Section
          </h2>
          <div className="text-xs tracking-wide bg-blue-600 text-white p-2 rounded-lg">
            Summary Budget
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-center">
            <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-blue-600 bg-blue-600 text-white select-none">
              Period
            </div>
            <select
              name="report-by-section-period"
              id="report-by-section-period"
              className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-blue-600 text-blue-600 bg-white outline-none"
              onChange={(e) => {
                setOptions({
                  type: "UPDATE_SECTION",
                  value: e.target.value,
                });
              }}
              value={options.bySection.period}
            >
              {periods.map((option, index) => {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <Link
          className="mt-4 xl:mt-8 | hover:shadow-xl | bg-black/5 hover:bg-black/25 active:bg-white | active:text-black | shadow-md self-center px-4 py-2 border rounded-4xl select-none"
          to={`/report?type=bysection&period=${options.bySection.period}`}
          target="_blank"
        >
          Show Report
        </Link>
      </div>

      <div className="flex flex-col p-8 bg-green-100 rounded-2xl items-start flex-1 justify-between">
        <div className="flex flex-col gap-4 items-start">
          <h2 className="text-3xl font-bold text-green-600">
            Report by Nature
          </h2>
          <div className="text-xs tracking-wide bg-green-600 text-white p-2 rounded-lg">
            Summary Budget
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-center">
            <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-green-600 bg-green-600 text-white select-none">
              Period
            </div>
            <select
              name="report-by-nature-period"
              id="report-by-nature-period"
              className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-green-600 text-green-600 bg-white outline-none"
              onChange={(e) => {
                setOptions({
                  type: "UPDATE_NATURE",
                  value: e.target.value,
                });
              }}
              value={options.byNature.period}
            >
              {periods.map((option, index) => {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <Link
          className="mt-4 xl:mt-8 | hover:shadow-xl | bg-black/5 hover:bg-black/25 active:bg-white | active:text-black | shadow-md self-center px-4 py-2 border rounded-4xl select-none"
          to={`/report?type=bynature&period=${options.bySection.period}`}
          target="_blank"
        >
          Show Report
        </Link>
      </div>
    </div>
  );
};

export default ReportView;
