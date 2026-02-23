import Placeholders from "../../../dummies/NewSubmitFormTable.json" with { type: "json" };
import SelectionInputSeparateLabel from "../../reusable/inputs/SelectionInputSeparateLabel.tsx";
import DEPARTMENTS from "../../../dummies/Departments.json" with { type: "json" };
import SelectionInput from "../../reusable/inputs/SelectionInput.tsx";
import TextInput from "../../reusable/inputs/TextInput.tsx";
import NumberInput from "../../reusable/inputs/NumberInput.tsx";
import DateInput from "../../reusable/inputs/DateInput.tsx";
import TipBox from "../../reusable/TipBox.tsx";
import type { ThirdStepInputs } from "../../../pages/Submit.tsx";
import { createGenericChangeHandler } from "../../../helper/genericInputHandler.ts";

const COLUMNS = [
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
const BUDGET_NATURE = [
  "537003000",
  "803046000",
  "803052000",
  "811046000",
  "811052000",
];
const CURRENCY = ["IDR", "JPY", "SGD", "USD"];
const STEP = 3;

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
  const genericChangeHandler = createGenericChangeHandler(
    thirdStepInputsInputsSetter,
  );
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
            mappings={DEPARTMENTS}
            value={thirdStepInputsGetter.costCenter}
            onChangeHandler={genericChangeHandler("costCenter")}
          />
          <SelectionInput
            label="Budget/Nature"
            name="budget/nature"
            id="budget/nature"
            requiredInput={false}
            variant="yellow"
            defaultDisabledValue="Select Budget/Nature"
            options={BUDGET_NATURE}
            value={thirdStepInputsGetter.budgetOrNature}
            onChangeHandler={genericChangeHandler("budgetOrNature")}
          />
          <TextInput
            label="Periode"
            name="periode"
            id="periode"
            variant="yellow"
            requiredInput={false}
            value={thirdStepInputsGetter.periode}
            onChangeHandler={genericChangeHandler("periode")}
          />
          <TextInput
            label="Balance"
            name="balance"
            id="balance"
            variant="yellow"
            requiredInput={false}
            value={thirdStepInputsGetter.balance}
            onChangeHandler={genericChangeHandler("balance")}
          />
          <TextInput
            label="Description"
            name="description"
            id="description"
            variant="yellow"
            requiredInput={false}
            value={thirdStepInputsGetter.description}
            onChangeHandler={genericChangeHandler("description")}
          />
          <NumberInput
            label="Quantity"
            name="quantity"
            id="quantity"
            variant="yellow"
            requiredInput={false}
            value={thirdStepInputsGetter.quantity}
            onChangeHandler={genericChangeHandler("quantity")}
          />
          <NumberInput
            label="Unit Price"
            name="unit-price"
            id="unit-price"
            variant="yellow"
            requiredInput={false}
            value={thirdStepInputsGetter.unitPrice}
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
            requiredInput={false}
            value={thirdStepInputsGetter.measure}
            onChangeHandler={genericChangeHandler("measure")}
          />
          <SelectionInput
            label="Currency"
            name="currency"
            id="currency"
            requiredInput={false}
            variant="yellow"
            defaultDisabledValue="Select Currency"
            options={CURRENCY}
            value={thirdStepInputsGetter.currency}
            onChangeHandler={genericChangeHandler("currency")}
          />
          <TextInput
            label="Vendor"
            name="vendor"
            id="vendor"
            variant="yellow"
            requiredInput={false}
            value={thirdStepInputsGetter.vendor}
            onChangeHandler={genericChangeHandler("vendor")}
          />
          <TextInput
            label="Reason"
            name="reason"
            id="reason"
            variant="yellow"
            requiredInput={false}
            value={thirdStepInputsGetter.reason}
            onChangeHandler={genericChangeHandler("reason")}
          />
          <DateInput
            label="Estimated Delivery Date"
            name="estimated-delivery-date"
            id="estimated-delivery-date"
            variant="yellow"
            requiredInput={false}
            value={thirdStepInputsGetter.estimatedDeliveryDate}
            onChangeHandler={genericChangeHandler("estimatedDeliveryDate")}
          />
        </div>
        <div className="flex-3 overflow-auto lg:overflow-y-auto max-h-64 lg:max-h-full lg:h-full border">
          <table className="table-auto border-collapse w-full">
            <thead className="sticky top-0 z-1 border">
              <tr>
                {COLUMNS.map((column, index) => {
                  return (
                    <th
                      key={index}
                      className="text-xs border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center"
                    >
                      {column}
                    </th>
                  );
                })}
                <th className="text-xs border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {Placeholders.map((placeholder, index) => {
                return (
                  <tr key={index}>
                    {COLUMNS.map((column, index) => {
                      return (
                        <td
                          key={index}
                          className="text-xs border p-2 whitespace-nowrap text-center"
                        >
                          {placeholder[column as keyof typeof placeholder]}
                        </td>
                      );
                    })}
                    <td className="bg-red-400 hover:bg-red-500 active:bg-red-600 | text-xs border p-2 whitespace-nowrap text-center select-none">
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
              <th className="text-xs lg:text-sm xl:text-base | border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center">
                Cost Center
              </th>
              <th className="text-xs lg:text-sm xl:text-base | border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center">
                Nature
              </th>
              <th className="text-xs lg:text-sm xl:text-base | border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center">
                Periode
              </th>
              <th className="text-xs lg:text-sm xl:text-base | border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center">
                Balance ($)
              </th>
              <th className="text-xs lg:text-sm xl:text-base | border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center">
                Usage ($)
              </th>
              <th className="text-xs lg:text-sm xl:text-base | border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center">
                Remain ($)
              </th>
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
              progressSetter((prev) => [...prev, STEP]);
              console.log(thirdStepInputsGetter);
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
