import SelectionInputSeparateLabel from "../../reusable/inputs/SelectionInputSeparateLabel.tsx";
import SelectionInput from "../../reusable/inputs/SelectionInput.tsx";
import TextInput from "../../reusable/inputs/TextInput.tsx";
import NumberInput from "../../reusable/inputs/NumberInput.tsx";
import DateInput from "../../reusable/inputs/DateInput.tsx";
import TipBox from "../../reusable/TipBox.tsx";
import { createGenericChangeHandler } from "../../../helper/genericInputHandler.ts";
import { useMemo, useState } from "react";
import Button from "../../reusable/Button.tsx";
import { dateSplitter } from "../../../helper/dateSplitter.ts";
import type {
  Balance,
  Department,
  Nature,
  ThirdStepInputs,
} from "@scope/server";
import type { ForexRates, ForexAPIResponse } from "../../../hooks/useForex.tsx";
import formatNumberToString from "../../../helper/formatNumberToString.ts";
import formatStringToNumber from "../../../helper/formatStringToNumber.ts";
import getCurrentPeriod from "../../../helper/getCurrentPeriod.ts";

const NO_BALANCE_VALUE = "No balance detected";

const USAGE_ATTRIBUTES = [
  "Cost Center",
  "Nature",
  "Description",
  "Qty",
  "Measure",
  "Unit Price",
  "Currency",
  "Rate",
  "Est. Delivery",
  "Vendor",
  "Reason",
  "ID Budget",
];

const BUDGET_SUMMARY_ATTRIBUTES = [
  "Cost Center",
  "Nature",
  "Periode",
  "Balance ($)",
  "Usage ($)",
  "Remain ($)",
];

const CURRENCY = ["IDR", "JPY", "SGD", "USD"];
const STEP = 3;

const EMPTY_FIELDS_WARNING =
  "You need to enter at least 1 usage before proceeding.";

const EMPTY_USAGE_FIELDS_WARNING =
  "One or more required usage fields are empty.\nPlease fill them out before adding a usage.";

export interface Usage {
  costCenter: string;
  budgetOrNature: string;
  periode: string;
  balance: string;
  description: string;
  quantity: string;
  unitPrice: string;
  measure: string;
  currency: string;
  vendor: string;
  reason: string;
  estimatedDeliveryDate: string;
}

interface BudgetSummary {
  costCenter: string;
  budgetOrNature: string;
  periode: string;
  balance: number;
  totalUsageUSD: number;
}

const DEFAULT_USAGE = {
  costCenter: "",
  budgetOrNature: "",
  periode: `${String(new Date().toLocaleString("default", { month: "long" }))} ${String(new Date().getFullYear())}`,
  balance: NO_BALANCE_VALUE,
  description: "",
  quantity: "",
  unitPrice: "",
  measure: "",
  currency: "",
  vendor: "",
  reason: "",
  estimatedDeliveryDate: "",
};

interface ThirdStepProps {
  progressSetter: React.Dispatch<React.SetStateAction<number[]>>;
  thirdStepInputsGetter: ThirdStepInputs;
  thirdStepInputsInputsSetter: React.Dispatch<
    React.SetStateAction<ThirdStepInputs>
  >;
  thirdStepInputsDefaultValue: ThirdStepInputs;
  forexInformation: ForexAPIResponse | null;
  departments: Department[] | null;
  natures: Nature[] | null;
  setActiveCostCenter: React.Dispatch<React.SetStateAction<string>>;
  fetchBalanceHelper: (
    costCenter: string,
    period: string,
    nature: string,
  ) => Promise<Balance[] | null>;
  submitterDepartmentName: string;
}

const ThirdStep = ({
  progressSetter,
  thirdStepInputsGetter,
  thirdStepInputsInputsSetter,
  thirdStepInputsDefaultValue,
  forexInformation,
  departments,
  natures,
  setActiveCostCenter,
  fetchBalanceHelper,
  submitterDepartmentName,
}: ThirdStepProps) => {
  const [usageField, setUsageField] = useState<Usage>(DEFAULT_USAGE);

  const genericChangeHandler = createGenericChangeHandler(setUsageField);

  const handleCostCenterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveCostCenter(e.target.value);
    setUsageField((prev) => ({
      ...prev,
      costCenter: e.target.value,
      budgetOrNature: DEFAULT_USAGE.budgetOrNature,
      balance: DEFAULT_USAGE.balance,
    }));
  };

  const handleBudgetOrNatureChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setUsageField((prev) => ({
      ...prev,
      budgetOrNature: e.target.value,
    }));

    const balanceData = await fetchBalanceHelper(
      usageField.costCenter,
      getCurrentPeriod(),
      e.target.value,
    );

    if (!balanceData || balanceData.length === 0) {
      setUsageField((prev) => ({ ...prev, balance: NO_BALANCE_VALUE }));
    } else {
      setUsageField((prev) => ({
        ...prev,
        balance: formatNumberToString(Number(balanceData[0].Balance)),
      }));
    }
  };

  const formatDate = (estDeliveryDate: string) => {
    const [year, month, day] = dateSplitter(estDeliveryDate);
    return `${day}-${month}-${year}`;
  };

  const summarizedBudgets = useMemo(() => {
    const summaryMap = thirdStepInputsGetter.usages.reduce(
      (accumulator, usage) => {
        const costCenterAndNatureCombination = `${usage.costCenter}-${usage.budgetOrNature}`;
        const qty = formatStringToNumber(usage.quantity);
        const price = formatStringToNumber(usage.unitPrice);
        const rawValue = qty * price;

        const forexRate =
          usage.currency === "USD"
            ? 1
            : formatStringToNumber(
                (
                  forexInformation?.rates[usage.currency as keyof ForexRates] ||
                  1
                ).toFixed(2),
              );

        const usdValue = rawValue / forexRate;

        if (!accumulator[costCenterAndNatureCombination]) {
          accumulator[costCenterAndNatureCombination] = {
            costCenter: usage.costCenter,
            budgetOrNature: usage.budgetOrNature,
            periode: getCurrentPeriod(),
            balance: formatStringToNumber(usage.balance),
            totalUsageUSD: 0,
          };
        }

        accumulator[costCenterAndNatureCombination].totalUsageUSD += usdValue;

        return accumulator;
      },
      {} as Record<string, BudgetSummary>,
    );

    return Object.values(summaryMap);
  }, [thirdStepInputsGetter.usages, forexInformation?.rates]);

  const totalUsage = useMemo(() => {
    return summarizedBudgets.reduce((total, summary) => {
      return total + summary.totalUsageUSD;
    }, 0);
  }, [summarizedBudgets]);

  const requiredFieldsAreEmpty = () => {
    if (thirdStepInputsGetter.usages.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const requiredUsageFieldsAreEmpty = () => {
    if (
      usageField.costCenter === DEFAULT_USAGE.costCenter ||
      usageField.budgetOrNature === DEFAULT_USAGE.budgetOrNature ||
      usageField.description === DEFAULT_USAGE.description ||
      usageField.quantity === DEFAULT_USAGE.quantity ||
      usageField.unitPrice === DEFAULT_USAGE.unitPrice ||
      usageField.measure === DEFAULT_USAGE.measure ||
      usageField.currency === DEFAULT_USAGE.currency ||
      usageField.vendor === DEFAULT_USAGE.vendor ||
      usageField.reason === DEFAULT_USAGE.reason ||
      usageField.estimatedDeliveryDate === DEFAULT_USAGE.estimatedDeliveryDate
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="rounded-2xl bg-yellow-100 p-8 flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-yellow-600">Step 3</h1>
      <TipBox
        label={`Do not let your budget get a red light`}
        variant="yellow"
      />
      <div className="flex flex-col lg:flex-row gap-3 lg:h-168">
        <div className="flex flex-col gap-2">
          <SelectionInputSeparateLabel
            label="Cost Center"
            name="cost-center"
            id="cost-center"
            requiredInput
            variant="yellow"
            defaultDisabledValue="Select Cost Center"
            mappings={
              !departments
                ? []
                : departments.map((department) => ({
                    code: department.CostCenter,
                    label: department.Description,
                  }))
            }
            value={usageField.costCenter}
            onChangeHandler={handleCostCenterChange}
          />
          <SelectionInput
            label="Budget/Nature"
            name="budget/nature"
            id="budget/nature"
            requiredInput
            variant="yellow"
            isDisabled={usageField.costCenter === ""}
            defaultDisabledValue="Select Budget/Nature"
            options={!natures ? [] : natures.map((nature) => nature.Nature)}
            value={usageField.budgetOrNature}
            onChangeHandler={handleBudgetOrNatureChange}
          />
          <TextInput
            label="Periode"
            name="periode"
            id="periode"
            variant="yellow"
            requiredInput={false}
            isDisabled
            value={usageField.periode}
            onChangeHandler={genericChangeHandler("periode")}
          />
          <TextInput
            label="Balance"
            name="balance"
            id="balance"
            variant="yellow"
            requiredInput={false}
            isDisabled
            value={usageField.balance}
            onChangeHandler={genericChangeHandler("balance")}
          />
          <TextInput
            label="Description"
            name="description"
            id="description"
            variant="yellow"
            requiredInput
            value={usageField.description}
            onChangeHandler={genericChangeHandler("description")}
            placeholder="e.g. Seagate HDD"
          />
          <NumberInput
            label="Quantity"
            name="quantity"
            id="quantity"
            variant="yellow"
            requiredInput
            value={usageField.quantity}
            onChangeHandler={genericChangeHandler("quantity")}
            placeholder="e.g. 175"
          />
          <NumberInput
            label="Unit Price"
            name="unit-price"
            id="unit-price"
            variant="yellow"
            requiredInput
            value={usageField.unitPrice}
            onChangeHandler={genericChangeHandler("unitPrice")}
            placeholder="e.g. 192500"
          />
          <TipBox
            label={`Jangan gunakan koma. Gunakan titik untuk desimal.`}
            variant="yellow"
          />
          <TextInput
            label="Measure"
            name="measure"
            id="measure"
            variant="yellow"
            requiredInput
            value={usageField.measure}
            onChangeHandler={genericChangeHandler("measure")}
            placeholder="e.g. kilogram"
          />
          <SelectionInput
            label="Currency"
            name="currency"
            id="currency"
            requiredInput
            variant="yellow"
            defaultDisabledValue="Select Currency"
            options={CURRENCY}
            value={usageField.currency}
            onChangeHandler={genericChangeHandler("currency")}
          />
          <TextInput
            label="Vendor"
            name="vendor"
            id="vendor"
            variant="yellow"
            requiredInput
            value={usageField.vendor}
            onChangeHandler={genericChangeHandler("vendor")}
            placeholder="e.g. Seagate Technology LLC"
          />
          <TextInput
            label="Reason"
            name="reason"
            id="reason"
            variant="yellow"
            requiredInput
            value={usageField.reason}
            onChangeHandler={genericChangeHandler("reason")}
            placeholder="e.g. Upgrading server"
          />
          <DateInput
            label="Estimated Delivery Date"
            name="estimated-delivery-date"
            id="estimated-delivery-date"
            variant="yellow"
            requiredInput
            value={usageField.estimatedDeliveryDate}
            onChangeHandler={genericChangeHandler("estimatedDeliveryDate")}
          />
          <div
            onClick={() => {
              if (usageField.balance === NO_BALANCE_VALUE) {
                globalThis.confirm(
                  "Your balance is empty. Please select a different Nature.",
                );
                return;
              }
              if (!requiredUsageFieldsAreEmpty()) {
                const newThirdStepInputs: ThirdStepInputs = {
                  usages: [
                    ...thirdStepInputsGetter.usages,
                    {
                      ...usageField,
                      periode: getCurrentPeriod(),
                    },
                  ],
                };
                thirdStepInputsInputsSetter(newThirdStepInputs);
                setUsageField(DEFAULT_USAGE);
              } else {
                globalThis.confirm(EMPTY_USAGE_FIELDS_WARNING);
              }
              console.log(usageField);
            }}
          >
            <Button id="add-usage" variant="yellow" label="Add Usage" />
          </div>
        </div>
        <div className="flex-3 overflow-auto lg:overflow-y-auto max-h-64 lg:max-h-full lg:h-full border">
          <table className="table-auto border-collapse w-full">
            <thead className="sticky top-0 z-1 border">
              <tr>
                {USAGE_ATTRIBUTES.map((attribute, index) => {
                  return (
                    <th
                      key={index}
                      className="text-xs border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center"
                    >
                      {attribute}
                    </th>
                  );
                })}
                <th className="text-xs border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {thirdStepInputsGetter.usages.map((usage, index) => {
                return (
                  <tr key={index}>
                    <td className="text-xs border p-2 whitespace-nowrap text-center">
                      {usage.costCenter}
                    </td>
                    <td className="text-xs border p-2 whitespace-nowrap text-center">
                      {usage.budgetOrNature}
                    </td>
                    <td className="text-xs border p-2 whitespace-nowrap text-center">
                      {usage.description}
                    </td>
                    <td className="text-xs border p-2 whitespace-nowrap text-center">
                      {usage.quantity}
                    </td>
                    <td className="text-xs border p-2 whitespace-nowrap text-center">
                      {usage.measure}
                    </td>
                    <td className="text-xs border p-2 whitespace-nowrap text-center">
                      {usage.unitPrice}
                    </td>
                    <td className="text-xs border p-2 whitespace-nowrap text-center">
                      {usage.currency}
                    </td>
                    <td className="text-xs border p-2 whitespace-nowrap text-center">
                      {`${usage.currency === "USD" ? `${formatNumberToString(Number(usage.quantity) * Number(usage.unitPrice))}` : formatNumberToString((Number(usage.unitPrice) * Number(usage.quantity)) / Number(forexInformation?.rates[usage.currency as keyof ForexRates] || 1))} USD`}
                    </td>
                    <td className="text-xs border p-2 whitespace-nowrap text-center">
                      {formatDate(usage.estimatedDeliveryDate)}
                    </td>
                    <td className="text-xs border p-2 whitespace-nowrap text-center">
                      {usage.vendor}
                    </td>
                    <td className="text-xs border p-2 whitespace-nowrap text-center">
                      {usage.reason}
                    </td>
                    <td className="text-xs border p-2 whitespace-nowrap text-center">
                      {`${usage.periode}-${usage.costCenter}-${submitterDepartmentName}`}
                    </td>
                    <td
                      className="bg-red-400 hover:bg-red-500 active:bg-red-600 | text-xs border p-2 whitespace-nowrap text-center select-none"
                      onClick={() => {
                        const newUsages = thirdStepInputsGetter.usages.filter(
                          (_, innerIndex) => innerIndex !== index,
                        );
                        const newThirdStepInputs: ThirdStepInputs = {
                          usages: [...newUsages],
                        };
                        thirdStepInputsInputsSetter(newThirdStepInputs);
                      }}
                    >
                      Delete
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {thirdStepInputsGetter.usages.length !== 0 && (
        <>
          <h2 className="text-xl font-bold text-yellow-600">Budget Summary</h2>
          <div className="overflow-auto">
            <table className="border-collapse w-full lg:w-max">
              <thead>
                <tr>
                  {BUDGET_SUMMARY_ATTRIBUTES.map((attribute, index) => {
                    return (
                      <th
                        key={index}
                        className="text-xs lg:text-sm xl:text-base | border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center"
                      >
                        {attribute}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {summarizedBudgets.map((summary, index) => {
                  const remainingBalance =
                    summary.balance - summary.totalUsageUSD;
                  return (
                    <tr key={index}>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {summary.costCenter}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {summary.budgetOrNature}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {summary.periode}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {formatNumberToString(summary.balance)}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {formatNumberToString(summary.totalUsageUSD)}
                      </td>
                      <td
                        className={`text-xs lg:text-sm xl:text-base |  | border p-2 whitespace-nowrap text-center`}
                      >
                        <span
                          className={
                            remainingBalance < 0 ? "font-bold text-red-500" : ""
                          }
                        >
                          {formatNumberToString(remainingBalance)}{" "}
                          {remainingBalance < 0 ? "[RL]" : ""}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {thirdStepInputsGetter.usages.length !== 0 && (
        <div className="flex gap-2">
          <div className="px-4 py-2 border rounded-lg bg-yellow-800 border-yellow-800 text-white font-bold select-none">
            Total Usage ($) : {formatNumberToString(totalUsage)}
          </div>
          <div className="flex gap-2 whitespace-nowrap">
            <div
              className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
              onClick={() => {
                setUsageField(DEFAULT_USAGE);
                progressSetter((prev) => prev.filter((num) => num !== STEP));
                thirdStepInputsInputsSetter(thirdStepInputsDefaultValue);
              }}
            >
              Clear
            </div>
            <div
              className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
              onClick={() => {
                if (!requiredFieldsAreEmpty()) {
                  progressSetter((prev) => [...prev, STEP]);
                } else {
                  globalThis.confirm(EMPTY_FIELDS_WARNING);
                }
              }}
            >
              Next
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThirdStep;
