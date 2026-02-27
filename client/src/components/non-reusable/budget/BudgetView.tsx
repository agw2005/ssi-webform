import React from "react";

interface MonthlyQuantifier {
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

interface BudgetViewData {
  Period: string;
  FileResource: string;
  DeptID: string;
  CostCenter: string;
  Nature: string;
  Description: string;
  Budget: MonthlyQuantifier;
  Usage: MonthlyQuantifier;
  Balance: MonthlyQuantifier;
}

const EXAMPLE_DATA: BudgetViewData[] = [
  {
    Period: "2025LH",
    FileResource: "ENG",
    DeptID: "200",
    CostCenter: "200",
    Nature: "803052000",
    Description: "CONSUMABLE TOOL AND FIXTURE (PROD)",
    Budget: {
      January: 2,
      February: 0,
      March: 897441.79,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 171,
      November: 91,
      December: 16,
    },
    Usage: {
      January: 7.6,
      February: 0,
      March: -167512.09,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 121,
      November: 0,
      December: 0,
    },
    Balance: {
      January: -5.6,
      February: 0,
      March: 1064953.88,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 50,
      November: 91,
      December: 16,
    },
  },
];

const THREE_COLSPAN_COLUMNS = [
  "(01) January",
  "(02) February",
  "(03) March",
  "(04) April",
  "(05) May",
  "(06) June",
  "(07) July",
  "(08) August",
  "(09) September",
  "(10) October",
  "(11) November",
  "(12) December",
];

const TWO_ROWSPAN_COLUMNS = [
  "File Resource",
  "Cost Center",
  "Nature",
  "Description",
];

const SUB_COLUMNS = ["Budget", "Usage", "Balance"];

const BudgetView = () => {
  const monthKeys: (keyof MonthlyQuantifier)[] = [
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

  const categories: (keyof Pick<
    BudgetViewData,
    "Budget" | "Usage" | "Balance"
  >)[] = ["Budget", "Usage", "Balance"];

  return (
    <div className="overflow-x-auto min-h-50 max-h-160 mt-4">
      <table className="table-auto border-collapse mt-4">
        <thead className="sticky top-0 z-10 border">
          <tr>
            {TWO_ROWSPAN_COLUMNS.map((column, index) => {
              return (
                <th
                  key={index}
                  rowSpan={2}
                  className="text-xs lg:text-sm xl:text-base | border p-2 bg-blue-800 text-white border-black whitespace-nowrap text-center"
                >
                  {column}
                </th>
              );
            })}
            {THREE_COLSPAN_COLUMNS.map((column, index) => {
              return (
                <th
                  key={index}
                  colSpan={3}
                  className="text-xs lg:text-sm xl:text-base | border p-2 bg-blue-700 text-white border-black whitespace-nowrap text-center"
                >
                  {column}
                </th>
              );
            })}
          </tr>
          <tr>
            {THREE_COLSPAN_COLUMNS.map((_column, index) => {
              return (
                <React.Fragment key={index}>
                  {SUB_COLUMNS.map((subcolumn, index) => {
                    return (
                      <th
                        key={index}
                        className="text-xs lg:text-sm xl:text-base | border p-2 bg-blue-800 text-white border-black whitespace-nowrap text-center"
                      >
                        {subcolumn}
                      </th>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            {EXAMPLE_DATA.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                    {item.FileResource} ({item.DeptID})
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                    {item.CostCenter}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                    {item.Nature}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border p-2 min-w-50 max-w-50 text-center">
                    {item.Description}
                  </td>
                  {monthKeys.map((month) => (
                    <React.Fragment key={month}>
                      {categories.map((category) => (
                        <td
                          key={`${month}-${category}`}
                          className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center"
                        >
                          {item[category][month].toLocaleString()}
                        </td>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BudgetView;
