import { useMemo, useRef, useState } from "react";
// @deno-types="https://cdn.sheetjs.com/xlsx-0.20.3/package/types/index.d.ts"
import * as XLSX from "xlsx";
import type { BudgetTable } from "@scope/server";
import { putBudgets } from "@scope/server";
import getCurrentPeriod from "../../../helper/getCurrentPeriod.ts";
import TipBox from "../../reusable/TipBox.tsx";
import Button from "../../reusable/Button.tsx";
import LoadingFallback from "../../reusable/LoadingFallback.tsx";
import ErrorFallback from "../../reusable/ErrorFallback.tsx";
import { webformAPI } from "../../../helper/apis.ts";
import { removeWhitespace } from "../../../helper/removeSpaces.ts";

interface AddViewProps {
  toggleDialog: (
    option: "empty" | "success" | "error",
    errMessage?: Error | null,
  ) => void;
}

interface MonthlyBudget {
  January: number;
  February: number;
  March: number;
  April: number;
  May: number;
  June: number;
  July: number;
  August: number;
  September: number;
  October: number;
  November: number;
  December: number;
}

interface DisplayBudgetData {
  CostCenter: string;
  Nature: string;
  Periode: string;
  IDSection: number;
  FileResource: string;
  Budget: MonthlyBudget;
}

const SECTION_ID_COLUMN_INDEX = 0;
const NATURE_COLUMN_INDEX = 1;
const FILE_RESOURCE_COLUMN_INDEX = 2;
const COST_CENTER_COLUMN_INDEX = 3;
const JANUARY_COLUMN_INDEX = 4;
const DECEMBER_COLUMN_INDEX = 15;

const TABLE_COLUMNS = [
  "Cost Center",
  "Nature",
  "ID Section",
  "File Resource",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AddView = ({ toggleDialog }: AddViewProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [budgetFile, setBudgetFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [budgetData, currentBudgetData] = useState<BudgetTable[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [submissionIsLoading, setSubmissionIsLoading] = useState(false);
  const [submissionIsError, setSubmissionIsError] = useState<Error | null>(
    null,
  );

  const handleSubmit = async () => {
    setSubmissionIsLoading(true);
    setSubmissionIsError(null);
    try {
      const response = await fetch(
        webformAPI.SubmitBudget,
        putBudgets(budgetData),
      );
      if (response.ok) {
        toggleDialog("success");
      }
      handleClearFile();
    } catch (err) {
      const error: Error = new Error(
        `Transport Failure: Your request did not reached the server. Please contact the administrator of this problem.\n(${err}).`,
      );
      setSubmissionIsError(error);
      toggleDialog("error");
    } finally {
      setSubmissionIsLoading(false);
      handleClearFile();
    }
  };

  const displayedBudgets: DisplayBudgetData[] = useMemo(() => {
    if (!budgetData) return [];

    const perMonthData = budgetData.reduce((accumulator, currentData) => {
      const key =
        `${currentData.CostCenter}-${currentData.Nature}-${currentData.IDSection}-${currentData.FileResource}`;
      const monthIndex = Number(currentData.Periode.slice(-2));
      const monthString = TABLE_COLUMNS[monthIndex + 3] as keyof MonthlyBudget;

      if (!accumulator[key]) {
        accumulator[key] = {
          CostCenter: currentData.CostCenter,
          Nature: currentData.Nature,
          Periode: String(selectedYear),
          IDSection: currentData.IDSection,
          FileResource: currentData.FileResource,
          Budget: {
            January: NaN,
            February: NaN,
            March: NaN,
            April: NaN,
            May: NaN,
            June: NaN,
            July: NaN,
            August: NaN,
            September: NaN,
            October: NaN,
            November: NaN,
            December: NaN,
          },
        };
      }

      if (monthString) {
        if (isNaN(accumulator[key].Budget[monthString])) {
          accumulator[key].Budget[monthString] = currentData.Budget;
        } else {
          accumulator[key].Budget[monthString] += currentData.Budget;
        }
      }

      return accumulator;
    }, {} as Record<string, DisplayBudgetData>);
    return Object.values(perMonthData);
  }, [budgetData, selectedYear]);

  const processFiles = async (newFile: File) => {
    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mb
    const invalid = newFile.size > MAX_SIZE_BYTES;

    if (invalid) {
      alert("One or more files exceeded the 5Mb limit.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setBudgetFile(newFile);
    const fileBinary = await newFile.arrayBuffer();
    const workbook = XLSX.read(fileBinary, { dense: true });
    const mainSheetName = workbook.SheetNames[0];
    const mainSheet = workbook.Sheets[mainSheetName];

    if (!mainSheet["!ref"]) {
      setBudgetFile(null);
      currentBudgetData([]);
      return;
    }

    const range = XLSX.utils.decode_range(mainSheet["!ref"]);

    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const sectionId = Number(
        mainSheet["!data"]?.[row]?.[SECTION_ID_COLUMN_INDEX].v,
      );
      const nature = removeWhitespace(String(
        mainSheet["!data"]?.[row]?.[NATURE_COLUMN_INDEX].v,
      ));
      const fileResource = removeWhitespace(String(
        mainSheet["!data"]?.[row]?.[FILE_RESOURCE_COLUMN_INDEX].v,
      ));
      const costCenter = removeWhitespace(String(
        mainSheet["!data"]?.[row]?.[COST_CENTER_COLUMN_INDEX].v,
      ));
      for (
        let column = JANUARY_COLUMN_INDEX;
        column <= DECEMBER_COLUMN_INDEX;
        column++
      ) {
        const cellBudgetValue = Number(
          mainSheet["!data"]?.[row]?.[column].v,
        );
        if (isNaN(cellBudgetValue)) continue;
        const newBudgetEntry: BudgetTable = {
          CostCenter: costCenter,
          Nature: nature,
          Periode: getCurrentPeriod(selectedYear, column - 3),
          Budget: cellBudgetValue,
          Balance: cellBudgetValue,
          IDSection: sectionId,
          FileResource: fileResource,
        };
        currentBudgetData((prev) => [...prev, newBudgetEntry]);
      }
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const budgetFile = fileList[0];
      processFiles(budgetFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setIsDragging(false);
      const fileList = e.dataTransfer.files;
      if (fileList && fileList.length > 0) {
        const budgetFile = fileList[0];
        processFiles(budgetFile);
      }
    }
  };

  const handleClearFile = () => {
    setBudgetFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    currentBudgetData([]);
  };

  if (submissionIsLoading) return <LoadingFallback />;
  if (submissionIsError) {
    return (
      <ErrorFallback
        componentName="AddView.tsx"
        errors={[submissionIsError]}
      />
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex gap-2">
        <TipBox label={String(selectedYear)} variant="black" />
        <div
          onClick={() =>
            setSelectedYear((prev) => {
              handleClearFile();
              return prev - 1;
            })}
        >
          <Button label="-" variant="black" id="decrement-year" />
        </div>
        <div
          onClick={() =>
            setSelectedYear((prev) => {
              handleClearFile();
              return prev + 1;
            })}
        >
          <Button label="+" variant="black" id="increment-year" />
        </div>
      </div>
      <label
        htmlFor="upload-budget-file"
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          border-3 flex flex-col gap-2 h-64 rounded-2xl items-center justify-center ${
          !budgetFile ? "border-dashed" : "border-solid"
        } ${
          isDragging
            ? "bg-black/15 border-blue-500"
            : "bg-black/0 hover:bg-black/7.5"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          name="upload-budget-file"
          id="upload-budget-file"
          hidden
          accept=".xlsx"
          onChange={handleFileUpload}
        />
        <div className="flex gap-4 items-center">
          <h3 className="font-bold text-4xl">
            {!budgetFile ? "Upload Your Budget Here" : budgetFile.name}
          </h3>
          {budgetFile && (
            <button
              type="button"
              className="bg-red-700/60 hover:bg-red-700/75 active:bg-red-700 | text-4xl font-bold rounded-2xl text-white px-2 py-1"
              onClick={handleClearFile}
            >
              X
            </button>
          )}
        </div>
        {!budgetFile && (
          <p>
            Use the following{" "}
            <a
              href={webformAPI.Template}
              target="_blank"
              className="text-blue-700"
            >
              template
            </a>{" "}
            as the base.
          </p>
        )}
      </label>
      {budgetFile && (
        <div className="overflow-x-auto min-h-25">
          <table className="table-auto border-collapse min-w-full">
            <thead>
              <tr>
                {TABLE_COLUMNS.map((column, index) => {
                  return (
                    <th
                      key={index}
                      className="whitespace-nowrap border p-2 bg-blue-700 text-white border-black"
                    >
                      {column}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {displayedBudgets.map((budgetData, outterIndex) => {
                return (
                  <tr
                    key={outterIndex}
                    className="whitespace-nowrap border p-2"
                  >
                    <td className="border p-2 text-center">
                      {budgetData.CostCenter}
                    </td>
                    <td className="border p-2 text-center">
                      {budgetData.Nature}
                    </td>
                    <td className="border p-2 text-center">
                      {budgetData.IDSection}
                    </td>
                    <td className="border p-2 text-center">
                      {budgetData.FileResource}
                    </td>
                    {TABLE_COLUMNS.slice(-12).map((month, innerIndex) => {
                      return (
                        <td key={innerIndex} className="border p-2">
                          {budgetData.Budget[month as keyof MonthlyBudget]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {!(budgetData.length < 1) &&
        (
          <div className="flex gap-2 items-center">
            <div
              onClick={() => {
                if (budgetData.length < 1) {
                  toggleDialog("empty");
                } else {
                  handleSubmit();
                }
              }}
            >
              <Button label="Add" variant="black" id="add-budget-button" />
            </div>
            <TipBox
              label="If there's a pre-existing budget value inside the database with the same [Cost Center/Nature/ID Section/File Resource], it will be overwritten!"
              variant="red"
            />
          </div>
        )}
    </div>
  );
};

export default AddView;
