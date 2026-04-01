import { Link, useSearchParams } from "react-router-dom";
import Primitive from "../components/reusable/Primitive.tsx";
import Button from "../components/reusable/Button.tsx";
import dateToMySQLDateInput from "../helper/dateToMySQLDateInput.ts";
import formatNumberToString from "../helper/formatNumberToString.ts";
import capitalize from "../helper/capitalize.ts";
import useBudgetUsages from "../hooks/useBudgetUsages.tsx";

const COLUMNS = [
  "Trace ID",
  "Item ID",
  "No.PR",
  "AcctAssgCategory",
  "Cost Center",
  "Nature",
  "Description",
  "Quantity",
  "Unit Price",
  "Currency",
  "Estimated Delivery Date",
  "Vendor",
  "Reason",
  "Is Rejected",
  "Rejected By",
  "Supplier",
  "Net Price",
  "Delivery Date",
  "No.PO",
  "Rate (1 USD)",
  "Budget ID",
];

const Usage = () => {
  const [searchParams] = useSearchParams();
  const year = searchParams.get("year") || "";
  const monthIndex = Number(searchParams.get("month")) || 0;
  const nature = searchParams.get("nature") || "";
  const costCenter = searchParams.get("costcenter") || "";
  const startDate = dateToMySQLDateInput(new Date(`${monthIndex}/1/${year}`));
  const endDate = dateToMySQLDateInput(
    new Date(
      `${monthIndex !== 12 ? monthIndex + 1 : 1}/1/${
        monthIndex !== 12 ? year : year + 1
      }`,
    ),
  );

  const params = new URLSearchParams();
  params.set("nature", nature);
  params.set("costcenter", costCenter);
  params.set("startdate", startDate);
  params.set("enddate", endDate);

  const { budgetUsages, usagesIsLoading, usagesIsError } = useBudgetUsages(
    params.toString(),
  );

  return (
    <Primitive
      isLoading={[usagesIsLoading]}
      isErr={[usagesIsError]}
      componentName="Usage.tsx"
      pageTitle="Usage"
    >
      <div className="flex" onClick={() => history.back()}>
        <Button id="go-back" variant="black" label="Back" />
      </div>
      {budgetUsages && budgetUsages.length === 0
        ? <div className="mt-4 font-bold">There is not items</div>
        : (
          <div className="overflow-x-auto min-h-50 max-h-160 mt-4">
            <table className="table-auto border-collapse mt-4">
              <thead className="sticky top-0 z-10 border">
                <tr>
                  {COLUMNS.map((column, index) => {
                    return (
                      <th
                        key={index}
                        className="text-xs lg:text-sm xl:text-base | border p-2 bg-blue-800 text-white border-black whitespace-nowrap text-center"
                      >
                        {column}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {budgetUsages &&
                  budgetUsages.map((budgetUsage, index) => {
                    return (
                      <tr key={index}>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.IDTrace}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.ItemId}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.NoPR}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.AcctAssgCategory
                            ? budgetUsage.AcctAssgCategory
                            : "-"}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.CostCenter}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.Nature}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 min-w-48 text-center">
                          <Link
                            className="text-blue-700 underline"
                            to={`/request/${budgetUsage.IDTrace}`}
                          >
                            {budgetUsage.Description}
                          </Link>
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {formatNumberToString(budgetUsage.Qty)}{" "}
                          {capitalize(budgetUsage.Measure)}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {formatNumberToString(budgetUsage.UnitPrice)}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.Currency}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.EstimationDeliveryDate}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.Vendor}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.Reason}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.StatusItem}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.RejectedBy
                            ? budgetUsage.RejectedBy
                            : "-"}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.Supplier ? budgetUsage.Supplier : "-"}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {formatNumberToString(
                            budgetUsage.UnitPrice * budgetUsage.Qty,
                          )}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.DeliveryDate
                            ? budgetUsage.DeliveryDate
                            : "-"}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.NoPO ? budgetUsage.NoPO : "-"}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {formatNumberToString(budgetUsage.Rate)}{" "}
                          {budgetUsage.Currency}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                          {budgetUsage.IDBudget}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
    </Primitive>
  );
};

export default Usage;
