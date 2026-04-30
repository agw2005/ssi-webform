import useForex, { type Forexes } from "../../../hooks/useForex.tsx";
import formatNumberToString from "../../../helper/formatNumberToString.ts";
import Button from "../../reusable/Button.tsx";
import { useEffect, useState } from "react";
import { webformAPI } from "../../../helper/apis.ts";
import { appCurrencies } from "@scope/server";

const RateView = () => {
  const {
    forexInformation: euForex,
    isLoading: _EuIsLoading,
    error: _EuIsErr,
    refetchForex: _EuRefetch,
  } = useForex("Eu");

  const {
    forexInformation: dbForex,
    isLoading: _DbIsLoading,
    error: _DbIsErr,
    refetchForex: DbRefetch,
  } = useForex("Db");

  const {
    forexInformation: dbTempForex,
    isLoading: _DbTempIsLoading,
    error: _DbTempIsErr,
    refetchForex: DbTempRefetch,
  } = useForex("Db", true);

  const [currentInputRates, setCurrentInputRates] = useState<Forexes>({
    IDR: dbForex?.rates.IDR || 0,
    JPY: dbForex?.rates.JPY || 0,
    SGD: dbForex?.rates.SGD || 0,
    USD: dbForex?.rates.USD || 0,
  });

  useEffect(() => {
    if (dbForex?.rates) {
      setCurrentInputRates({
        IDR: dbForex.rates.IDR,
        JPY: dbForex.rates.JPY,
        SGD: dbForex.rates.SGD,
        USD: dbForex.rates.USD,
      });
    }
  }, [dbForex]);

  const handleRenewal = async () => {
    const newForexes = [
      { currency: "IDR", value: currentInputRates.IDR },
      { currency: "JPY", value: currentInputRates.JPY },
      { currency: "SGD", value: currentInputRates.SGD },
      { currency: "USD", value: currentInputRates.USD },
    ];

    for (const forex of newForexes) {
      const url = new URL(
        webformAPI.NewForex,
        globalThis.location.origin,
      );

      const params = new URLSearchParams();

      params.append("currency", forex.currency);

      params.append("value", String(forex.value));

      url.search = params.toString();

      await fetch(url, { method: "PATCH" });
    }

    await DbRefetch();
    await DbTempRefetch();
  };

  return (
    <div className="mt-4 flex flex-col gap-8">
      <table className="table-auto border-collapse min-w-full max-w-full">
        <thead>
          <tr>
            <th>
            </th>
            <th className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border p-2 bg-blue-800 text-white border-black">
              European Union Dollar Rates
            </th>
            <th className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border p-2 bg-blue-800 text-white border-black">
              Webform Database Dollar Rates
            </th>
            <th className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border p-2 bg-blue-800 text-white border-black">
              Webform Database Dollar Rates (Temporary)
            </th>
          </tr>
        </thead>
        <tbody>
          {appCurrencies.map((forex, index) => {
            const currencyKey = forex as keyof Forexes;
            const currentEuForex = euForex?.rates[currencyKey];
            const currentDbForex = dbForex?.rates[currencyKey];
            const currentDbTempForex = dbTempForex?.rates[currencyKey];
            return (
              <tr key={index}>
                <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border p-2 bg-blue-800 text-white border-black text-center font-bold">
                  {forex}
                </td>
                <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap text-center border break-all p-2">
                  {currentEuForex
                    ? formatNumberToString(currentEuForex, 6)
                    : "N/A"}
                </td>
                <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap text-center border break-all p-2">
                  {currentDbForex
                    ? formatNumberToString(currentDbForex, 6)
                    : "N/A"}
                </td>
                <td
                  className={`text-xs lg:text-sm xl:text-base | ${
                    currentDbForex !== currentDbTempForex ? "bg-red-300" : ""
                  } whitespace-nowrap text-center border break-all p-2`}
                >
                  {currentDbTempForex
                    ? formatNumberToString(currentDbTempForex, 6)
                    : "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-xl">New Rates</h2>
        {appCurrencies.map((forex, index) => {
          const currencyKey = forex as keyof Forexes;
          const lowercaseCurrency = forex.toLowerCase();
          return (
            <label
              key={index}
              htmlFor={`new-${lowercaseCurrency}`}
              className="flex gap-2 items-center"
            >
              <input
                type="number"
                name={`new-${lowercaseCurrency}`}
                id={`new-${lowercaseCurrency}`}
                className="border rounded-xl outline none px-2 py-1"
                value={currentInputRates[currencyKey]}
                onChange={(e) => {
                  const value = Number(e.currentTarget.value);
                  setCurrentInputRates((prev) => ({
                    ...prev,
                    [currencyKey]: value,
                  }));
                }}
              />
              <p>{currencyKey}</p>
            </label>
          );
        })}
        <div
          className="w-max"
          onClick={handleRenewal}
        >
          <Button id="submit-new-rate-dollar" variant="black" label="Update" />
        </div>
      </div>
    </div>
  );
};

export default RateView;
