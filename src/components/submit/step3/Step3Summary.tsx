import items from "../../../dummies/ItemPR.json";
import { useForex } from "../../../hooks/useForex.tsx";

const Step3Summary = () => {
  const { forexInformation, isLoading, error } = useForex();

  const rates = forexInformation;

  const convertToUSD = (price: number, currency: string) => {
    switch (currency) {
      case "IDR":
        return "IDR TO USD";

      case "JPY":
        return "JPY TO USD";

      case "SGD":
        return "SGD TO USD";

      case "USD":
      default:
        return "USD TO USD";
    }
  };

  /**
   * TOTAL USAGE (USD)
   */

  const BALANCE = 1;
  const remain = BALANCE - 0;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3">Budget Summary</h3>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-orange-200">
            <tr className="text-sm text-gray-700">
              <th className="px-4 py-3 text-left">Cost Center</th>
              <th className="px-4 py-3 text-left">Nature</th>
              <th className="px-4 py-3 text-left">Periode</th>
              <th className="px-4 py-3 text-left">Balance ($)</th>
              <th className="px-4 py-3 text-left">Usage ($)</th>
              <th className="px-4 py-3 text-left">Remain ($)</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            <tr className="text-sm">
              <td className="px-4 py-3">104</td>
              <td className="px-4 py-3">537003000</td>
              <td className="px-4 py-3">2025LH02-104-MIS</td>

              <td className="px-4 py-3">{BALANCE.toFixed(2)}</td>

              <td className="px-4 py-3">{0}</td>

              <td
                className={`px-4 py-3 font-semibold ${
                  remain < 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {remain.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TOTAL BOX */}
      <div className="mt-6">
        <div className="inline-block border-2 border-blue-500 bg-blue-50 rounded-lg px-6 py-3 shadow-sm">
          <span className="font-semibold text-blue-700">
            Your Total Usage ($)
          </span>

          <span className="ml-2 font-bold text-blue-900">
            {0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Step3Summary;
