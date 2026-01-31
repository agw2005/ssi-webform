import { useEffect, useState } from "react";
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
  { name: "Webform", link: "#" },
  { name: "Home", link: "#" },
  { name: "Submit Form", link: "#" },
  { name: "Approval Menu", link: "#" },
  { name: "Budget", link: "#" },
  { name: "Account", link: "#" },
];

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
            if (navigation.name === "Webform") {
              return (
                <a href={navigation.link} key={index}>
                  <ToolTip text={navigation.name} underline={false}>
                    <div className="p-2 bg-white text-black border-2 min-w-max text-xs opacity-10 ">
                      Website made by:
                      <p>Danial Al-Ghazali Walangadi (UNNES 2304130143)</p>
                      <p>Antonio Vianzar (UNNES 2304130173)</p>
                    </div>
                  </ToolTip>
                </a>
              );
            }
            return (
              <a href={navigation.link} key={index}>
                {navigation.name}
              </a>
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
                      {forexInformation?.amount}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center px-2 font-bold">IDR</td>
                    <td className="text-center px-2">
                      {forexInformation?.rates.IDR}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center px-2 font-bold">JPY</td>
                    <td className="text-center px-2">
                      {forexInformation?.rates.JPY}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center px-2 font-bold">SGD</td>
                    <td className="text-center px-2">
                      {forexInformation?.rates.SGD}
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
