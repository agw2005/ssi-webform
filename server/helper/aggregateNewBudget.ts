import type { BudgetTable } from "@scope/server";

export const aggregateNewBudget = (
  budgetInput: BudgetTable[],
): BudgetTable[] => {
  const aggregatedMap = budgetInput.reduce((accumulator, current) => {
    const { CostCenter, FileResource, IDSection, Nature, Periode } = current;
    const compositeKey =
      `${CostCenter}-${FileResource}-${IDSection}-${Nature}-${Periode}`;
    const compositeKeyAlreadyExist = accumulator.get(compositeKey);

    if (compositeKeyAlreadyExist) {
      compositeKeyAlreadyExist.Budget += current.Budget;
      compositeKeyAlreadyExist.Balance += current.Balance;
    } else {
      accumulator.set(compositeKey, { ...current });
    }

    return accumulator;
  }, new Map<string, BudgetTable>());

  return [...aggregatedMap.values()];
};
