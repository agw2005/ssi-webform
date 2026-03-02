import SelectionInputSeparateLabel from "../../reusable/inputs/SelectionInputSeparateLabel.tsx";
import SelectionInput from "../../reusable/inputs/SelectionInput.tsx";
import TextInput from "../../reusable/inputs/TextInput.tsx";
import NumberInput from "../../reusable/inputs/NumberInput.tsx";
import DateInput from "../../reusable/inputs/DateInput.tsx";
import TipBox from "../../reusable/TipBox.tsx";
import type { ThirdStepInputs } from "../../../pages/Submit.tsx";
import { createGenericChangeHandler } from "../../../helper/genericInputHandler.ts";
import { useState } from "react";
import Button from "../../reusable/Button.tsx";
import { dateSplitter } from "../../../helper/dateSplitter.ts";
import type { Balance, Department, Nature } from "@scope/server";
import useFetch from "../../../hooks/useFetch.tsx";
import LoadingFallback from "../../reusable/LoadingFallback.tsx";
import getCurrentPeriod from "../../../helper/getCurrentPeriod.ts";
import useForex, { type ForexRates } from "../../../hooks/useForex.tsx";

const DEPARTMENTS_URL = "http://localhost:8000/frmprnopr/departments";
const NATURES_URL = "http://localhost:8000/budget/nature";
const BALANCE_URL = (costCenter: string, period: string, nature: string) =>
  `http://localhost:8000/budget/nature/${costCenter}/${period}/${nature}`;

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

const FETCHING_BALANCE_ERROR =
  "Failed to fetch balance. Please try again or contact the administrator.\n";

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

const DEFAULT_USAGE = {
  costCenter: "",
  budgetOrNature: "",
  periode: getCurrentPeriod(),
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
}

const ThirdStep = ({
  progressSetter,
  thirdStepInputsGetter,
  thirdStepInputsInputsSetter,
  thirdStepInputsDefaultValue,
}: ThirdStepProps) => {
  const [usageField, setUsageField] = useState<Usage>(DEFAULT_USAGE);

  const {
    forexInformation,
    isLoading: _forexIsLoading,
    error: _forexIsError,
  } = useForex();

  const genericChangeHandler = createGenericChangeHandler(setUsageField);

  const handleCostCenterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

    try {
      const balanceResponse = await fetch(
        BALANCE_URL(usageField.costCenter, usageField.periode, e.target.value),
      );

      if (!balanceResponse.ok) {
        throw new Error(`HTTP error! status: ${balanceResponse.status}`);
      }

      const balance: Balance[] = await balanceResponse.json();

      if (balance.length === 0) {
        setUsageField((prev) => ({
          ...prev,
          balance: NO_BALANCE_VALUE,
        }));
      } else {
        setUsageField((prev) => ({
          ...prev,
          balance: balance[0].Balance,
        }));
      }
    } catch (err) {
      console.error(FETCHING_BALANCE_ERROR, err);
    }
  };

  const formatDate = (estDeliveryDate: string) => {
    const [year, month, day] = dateSplitter(estDeliveryDate);
    return `${day}-${month}-${year}`;
  };

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

  const {
    data: departments,
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useFetch<Department>(DEPARTMENTS_URL);

  const {
    data: natures,
    isLoading: isNaturesLoading,
    isError: isNaturesError,
  } = useFetch<Nature>(`${NATURES_URL}/${usageField.costCenter || "103"}`);

  if (isDepartmentsLoading || isNaturesLoading) {
    return <LoadingFallback />;
  }

  if (isDepartmentsError) {
    return (
      <div className="m-4">
        <div>Something unexpected happened.</div>
        {isDepartmentsError ? isDepartmentsError.message : ""}
      </div>
    );
  }

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
            options={
              !natures || isNaturesError
                ? []
                : natures.map((nature) => nature.Nature)
            }
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
            requiredInput
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
          />
          <NumberInput
            label="Quantity"
            name="quantity"
            id="quantity"
            variant="yellow"
            requiredInput
            value={usageField.quantity}
            onChangeHandler={genericChangeHandler("quantity")}
          />
          <NumberInput
            label="Unit Price"
            name="unit-price"
            id="unit-price"
            variant="yellow"
            requiredInput={false}
            value={usageField.unitPrice}
            onChangeHandler={genericChangeHandler("unitPrice")}
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
          />
          <TextInput
            label="Reason"
            name="reason"
            id="reason"
            variant="yellow"
            requiredInput
            value={usageField.reason}
            onChangeHandler={genericChangeHandler("reason")}
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
                  usages: [...thirdStepInputsGetter.usages, usageField],
                };
                thirdStepInputsInputsSetter(newThirdStepInputs);
                setUsageField(DEFAULT_USAGE);
              } else {
                globalThis.confirm(EMPTY_USAGE_FIELDS_WARNING);
              }
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
                      {`${usage.currency === "USD" ? `${(Number(usage.quantity) * Number(usage.unitPrice)).toFixed(2)}` : ((Number(usage.unitPrice) * Number(usage.quantity)) / Number((forexInformation?.rates[usage.currency as keyof ForexRates] || 1).toFixed(2))).toFixed(2)} USD`}
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
                      [ID] {/* Placeholder of ID Budget for the time being */}
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
            <tr>
              <td className="text-xs lg:text-sm xl:text-base | border p-2 wditespace-nowrap text-center">
                104
              </td>
              <td className="text-xs lg:text-sm xl:text-base | border p-2 wditespace-nowrap text-center">
                537003000
              </td>
              <td className="text-xs lg:text-sm xl:text-base | border p-2 wditespace-nowrap text-center">
                2025LH02-104-MIS
              </td>
              <td className="text-xs lg:text-sm xl:text-base | border p-2 wditespace-nowrap text-center">
                1.00
              </td>
              <td className="text-xs lg:text-sm xl:text-base | border p-2 wditespace-nowrap text-center">
                0
              </td>
              <td className="text-xs lg:text-sm xl:text-base | border p-2 wditespace-nowrap text-center">
                1.00
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <div className="px-4 py-2 border rounded-lg bg-yellow-800 border-yellow-800 text-white font-bold select-none">
          Total Usage ($) : 0
        </div>
        <div className="flex gap-2 whitespace-nowrap">
          <div
            className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
            onClick={() => {
              setUsageField(DEFAULT_USAGE);
              progressSetter((prev) => prev.filter((num) => num !== STEP));
              thirdStepInputsInputsSetter(thirdStepInputsDefaultValue);
              console.log(thirdStepInputsGetter);
            }}
          >
            Clear
          </div>
          <div
            className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
            onClick={() => {
              if (!requiredFieldsAreEmpty()) {
                progressSetter((prev) => [...prev, STEP]);
                console.log(thirdStepInputsGetter);
              } else {
                globalThis.confirm(EMPTY_FIELDS_WARNING);
              }
            }}
          >
            Next
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdStep;
