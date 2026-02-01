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
      <nav className="flex justify-between bg-black text-white pl-8 sticky inset-0">
        <div className="flex gap-10 my-4">
          {NAVIGATIONS.map((navigation, index) => {
            return (
              <a href={navigation.link} key={index}>
                {navigation.name}
              </a>
            );
          })}
        </div>
        <div className="flex">
          <div className="relative px-4 flex items-center">
            <img
              src="/flag-of-singapore.png"
              alt="singaporean flag"
              className="absolute inset-0 w-full h-full opacity-30 select-none"
            />
            <p className="z-1">
              {forexInformation?.rates.SGD.toLocaleString(
                "en-US",
                FOREX_RATES_STRING_FORMAT,
              ) + " "}
              <strong>SGD</strong>
            </p>
          </div>
          <div className="relative px-4 flex items-center">
            <img
              src="/flag-of-japan.png"
              alt="japanese flag"
              className="absolute inset-0 w-full h-full opacity-30 select-none"
            />
            <p className="z-1">
              {forexInformation?.rates.JPY.toLocaleString(
                "en-US",
                FOREX_RATES_STRING_FORMAT,
              ) + " "}
              <strong>JPY</strong>
            </p>
          </div>
          <div className="relative px-4 flex items-center">
            <img
              src="/flag-of-indonesia.png"
              alt="indonesian flag"
              className="absolute inset-0 w-full h-full opacity-30 select-none"
            />
            <p className="z-1">
              {forexInformation?.rates.IDR.toLocaleString(
                "en-US",
                FOREX_RATES_STRING_FORMAT,
              ) + " "}
              <strong>IDR</strong>
            </p>
          </div>
          <div className="relative px-4 flex items-center">
            <img
              src="/flag-of-america.png"
              alt="american flag"
              className="absolute inset-0 w-full h-full opacity-30 select-none"
            />
            <p className="z-1">
              {forexInformation?.amount.toLocaleString(
                "en-US",
                FOREX_RATES_STRING_FORMAT,
              ) + " "}
              <strong>{forexInformation?.base}</strong>
            </p>
          </div>
          <div className="px-8 hover:bg-white hover:text-black active:bg-gray-800 active:text-white flex items-center">
            <p className="select-none">User</p>
          </div>
        </div>
      </nav>
      <main className="mx-16 mt-16 bg-white p-4">{children}</main>
    </div>
  );
};

export default Primitive;
