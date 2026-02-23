import Placeholders from "../../../dummies/BudgetSearchTable.json" with { type: "json" };

interface BudgetViewProps {
  columns: string[];
}

const BudgetView = ({ columns }: BudgetViewProps) => {
  return (
    <div className="overflow-x-auto h-160 mt-4">
      <table className="table-auto border-collapse mt-4">
        <thead className="sticky top-0 z-10 border">
          <tr>
            {columns.map((column, index) => {
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
          {Placeholders.map((placeholder, index) => {
            return (
              <tr key={index}>
                {columns.map((column, index) => {
                  return (
                    <td
                      key={index}
                      className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center"
                    >
                      {placeholder[column as keyof typeof placeholder]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetView;
