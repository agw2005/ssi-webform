import type { BudgetTable } from "@scope/server";

export const aggregateNewBudget = (budgetInput: BudgetTable[]) => {
  const reducedData: BudgetTable[] = Array.from(
    budgetInput.reduce((accumulator, currentBudget) => {
      const compositeKey =
        `${currentBudget.CostCenter}|${currentBudget.FileResource}|${currentBudget.IDSection}|${currentBudget.Nature}|${currentBudget.Periode}`;

      const existing = accumulator.get(compositeKey);
      if (existing) {
        existing.Budget += currentBudget.Budget;
        existing.Balance += currentBudget.Balance;
      } else {
        accumulator.set(compositeKey, { ...currentBudget });
      }

      return accumulator;
    }, new Map<string, BudgetTable>()).values(),
  );

  return reducedData;
};
