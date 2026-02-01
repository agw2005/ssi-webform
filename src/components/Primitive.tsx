import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ToolTip from "./ToolTip";

interface PrimitiveProps {
  children: React.ReactNode;
}

interface ForexRates {
  IDR: number;
  JPY: number;
  SGD: number;
}

interface ForexAPIRespnse {
  amount: number;
  base: string;
  date: string;
  rates: ForexRates;
}
const FOREX_API_URL =
  "https://api.frankfurter.dev/v1/latest?symbols=IDR,JPY,SGD&base=USD";

const NAVIGATIONS = [
  { name: "Webform", link: "/" },
  { name: "Home", link: "/" },
  { name: "Submit Form", link: "/submit" },
  { name: "Approval Menu", link: "#" },
  { name: "Budget", link: "#" },
  { name: "Account", link: "#" },
];

const FOREX_RATES_STRING_FORMAT = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const Primitive = ({ children }: PrimitiveProps) => {
  const [forexInformation, setForexInformation] =
    useState<ForexAPIRespnse | null>(null);

  async function fetchForexInformation() {
    const response = await fetch(FOREX_API_URL);
    const data: ForexAPIRespnse = await response.json();
    setForexInformation(data);
  }

  useEffect(() => {
    fetchForexInformation();
  }, []);

  useEffect(() => {
    console.log(forexInformation);
  }, [forexInformation]);

  return (
    <div className="bg-yellow-600/25 min-h-screen pb-16">
      <nav className="flex justify-between bg-black text-white py-4 px-8 sticky inset-0">
        <div className="flex gap-10">
          {NAVIGATIONS.map((navigation, index) => {
            return (
              <Link
                to={navigation.link}
                key={index}
                className="hover:text-yellow-300 transition"
              >
                {navigation.name}
              </Link>
            );
          })}
        </div>
        <div className="flex gap-10">
          <ToolTip text="Show Forex">
            <div className="bg-yellow-200 text-black p-2 rounded-2xl border-2">
              <table>
                <tbody>
                  <tr>
                    <td className="text-center px-2 font-bold">
                      {forexInformation?.base}
                    </td>
                    <td className="text-center px-2">
                      {forexInformation?.amount.toLocaleString(
                        "en-US",
                        FOREX_RATES_STRING_FORMAT,
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center px-2 font-bold">IDR</td>
                    <td className="text-center px-2">
                      {forexInformation?.rates.IDR.toLocaleString(
                        "en-US",
                        FOREX_RATES_STRING_FORMAT,
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center px-2 font-bold">JPY</td>
                    <td className="text-center px-2">
                      {forexInformation?.rates.JPY.toLocaleString(
                        "en-US",
                        FOREX_RATES_STRING_FORMAT,
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center px-2 font-bold">SGD</td>
                    <td className="text-center px-2">
                      {forexInformation?.rates.SGD.toLocaleString(
                        "en-US",
                        FOREX_RATES_STRING_FORMAT,
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ToolTip>
          <button type="button">User</button>
        </div>
      </nav>
      <main className="mx-16 mt-16 bg-white p-4">{children}</main>
    </div>
  );
};

export default Primitive;
