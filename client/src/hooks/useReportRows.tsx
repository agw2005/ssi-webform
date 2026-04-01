import { useMemo } from "react";
import type { Row } from "../pages/Report.tsx";
import type { ReportResponse } from "@scope/server";

export const useReportRows = (
  reportData: ReportResponse[] | null,
  filter: ("CostCenter" | "Nature" | "Dept" | "AdmOrProd")[],
) => {
  if (filter.includes("Nature")) {
    if (filter.includes("CostCenter")) {
      return useMemo(() => {
        const map = new Map<string, Row>();

        reportData?.forEach((data) => {
          const key = `${data.CostCenter}-${data.Nature}`;
          let row = map.get(key);
          if (!row) {
            row = {
              Department: data.Department,
              CostCenter: data.CostCenter,
              Nature: data.Nature,
              DepartmentGroup: data.DepartmentGroup,
              Description: data.Description,
              Months: {},
              TotalBudget: 0,
              TotalBalance: 0,
            };
            map.set(key, row);
          }

          const monthKey = data.Periode.substring(6, 8);
          const budget = Number(data.Budget || 0);
          const balance = Number(data.Balance || 0);

          row.Months[monthKey] = {
            Budget: budget,
            Balance: balance,
            Usage: budget - balance,
          };

          row.TotalBudget += budget;
          row.TotalBalance += balance;
        });

        return Array.from(map.values()).sort((rowA, rowB) => {
          if (rowA.Department !== rowB.Department) {
            return rowA.Department - rowB.Department;
          }
          const descriptionSorting = rowA.Description.localeCompare(
            rowB.Description,
          );
          if (descriptionSorting !== 0) {
            return descriptionSorting;
          }
          return rowA.Nature.localeCompare(rowB.Nature);
        });
      }, [reportData]);
    } else if (filter.includes("Dept")) {
      return useMemo(() => {
        const map = new Map<string, Row>();

        reportData?.forEach((data) => {
          const key = `${data.Department}-${data.Nature}`;
          let row = map.get(key);

          if (!row) {
            row = {
              Department: data.Department,
              CostCenter: data.CostCenter,
              Nature: data.Nature,
              DepartmentGroup: data.DepartmentGroup,
              Description: data.Description,
              Months: {},
              TotalBudget: 0,
              TotalBalance: 0,
            };
            map.set(key, row);
          }

          const monthKey = data.Periode.substring(6, 8);
          const budget = Number(data.Budget || 0);
          const balance = Number(data.Balance || 0);
          const usage = budget - balance;

          if (!row.Months[monthKey]) {
            row.Months[monthKey] = { Budget: 0, Balance: 0, Usage: 0 };
          }

          row.Months[monthKey].Budget += budget;
          row.Months[monthKey].Balance += balance;
          row.Months[monthKey].Usage += usage;

          row.TotalBudget += budget;
          row.TotalBalance += balance;
        });

        return Array.from(map.values()).sort((rowA, rowB) => {
          if (rowA.Department !== rowB.Department) {
            return rowA.Department - rowB.Department;
          }
          const descriptionSorting = rowA.Description.localeCompare(
            rowB.Description,
          );
          if (descriptionSorting !== 0) {
            return descriptionSorting;
          }
          return rowA.Nature.localeCompare(rowB.Nature);
        });
      }, [reportData]);
    } else if (filter.includes("AdmOrProd")) {
      return useMemo(() => {
        const map = new Map<string, Row>();

        reportData?.forEach((data) => {
          const key = `${data.Nature}`;
          let row = map.get(key);

          if (!row) {
            row = {
              Department: data.Department,
              CostCenter: data.CostCenter,
              Nature: data.Nature,
              DepartmentGroup: data.DepartmentGroup,
              Description: data.Description,
              Months: {},
              TotalBudget: 0,
              TotalBalance: 0,
            };
            map.set(key, row);
          }

          const monthKey = data.Periode.substring(6, 8);
          const budget = Number(data.Budget || 0);
          const balance = Number(data.Balance || 0);
          const usage = budget - balance;

          if (!row.Months[monthKey]) {
            row.Months[monthKey] = { Budget: 0, Balance: 0, Usage: 0 };
          }

          row.Months[monthKey].Budget += budget;
          row.Months[monthKey].Balance += balance;
          row.Months[monthKey].Usage += usage;

          row.TotalBudget += budget;
          row.TotalBalance += balance;
        });

        return Array.from(map.values()).sort((rowA, rowB) => {
          const categoryA = rowA.Description.includes("(ADM)")
            ? "Administration"
            : "Production";
          const categoryB = rowB.Description.includes("(ADM)")
            ? "Administration"
            : "Production";

          if (categoryA !== categoryB) {
            return categoryA.localeCompare(categoryB);
          }

          const natureSorting = rowA.Nature.localeCompare(rowB.Nature);
          if (natureSorting !== 0) {
            return natureSorting;
          }

          if (rowA.Department !== rowB.Department) {
            return Number(rowA.Department) - Number(rowB.Department);
          }

          return rowA.Description.localeCompare(rowB.Description);
        });
      }, [reportData]);
    } else {
      return [];
    }
  } else {
    return [];
  }
};
