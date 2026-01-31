import { useEffect, useState } from "react";

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
            return (
              <a href={navigation.link} key={index}>
                {navigation.name}
              </a>
            );
          })}
        </div>
        <div className="flex gap-10">
          <button type="button">Show Forex</button>
          <button type="button">User</button>
        </div>
      </nav>
      <main className="mx-16 mt-16 bg-white p-4">{children}</main>
    </div>
  );
};

export default Primitive;
