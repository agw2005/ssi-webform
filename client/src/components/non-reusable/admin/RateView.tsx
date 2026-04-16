import useForex from "../../../hooks/useForex.tsx";
import formatNumberToString from "../../../helper/formatNumberToString.ts";
import Button from "../../reusable/Button.tsx";
import { useEffect, useState } from "react";
import { webformAPI } from "../../../helper/apis.ts";

const forexes = ["IDR", "JPY", "SGD", "USD"];

interface InputRates {
  IDR: number;
  JPY: number;
  SGD: number;
  USD: number;
}

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

  const [currentInputRates, setCurrentInputRates] = useState<InputRates>({
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

  return (
    <div className="flex flex-col gap-8">
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
          </tr>
        </thead>
        <tbody>
          {forexes.map((forex, index) => {
            return (
              <tr key={index}>
                <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border p-2 bg-blue-800 text-white border-black text-center font-bold">
                  {forex}
                </td>
                <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap text-center border break-all p-2">
                  {forex === forexes[0]
                    ? formatNumberToString(Number(euForex?.rates.IDR))
                    : forex === forexes[1]
                    ? formatNumberToString(Number(euForex?.rates.JPY))
                    : forex === forexes[2]
                    ? formatNumberToString(Number(euForex?.rates.SGD))
                    : forex === forexes[3]
                    ? formatNumberToString(Number(euForex?.rates.USD))
                    : ""}
                </td>
                <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap text-center border break-all p-2">
                  {forex === forexes[0]
                    ? formatNumberToString(Number(dbForex?.rates.IDR))
                    : forex === forexes[1]
                    ? formatNumberToString(Number(dbForex?.rates.JPY))
                    : forex === forexes[2]
                    ? formatNumberToString(Number(dbForex?.rates.SGD))
                    : forex === forexes[3]
                    ? formatNumberToString(Number(dbForex?.rates.USD))
                    : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-xl">New Values</h2>
        <label htmlFor="new-idr" className="flex gap-2 items-center">
          <input
            type="number"
            name="new-idr"
            id="new-idr"
            className="border outline none px-2 py-1"
            value={currentInputRates.IDR}
            onChange={(e) => {
              const value = Number(e.currentTarget.value);
              setCurrentInputRates((prev) => ({
                ...prev,
                IDR: value,
              }));
            }}
          />
          <p>IDR</p>
        </label>
        <label htmlFor="new-jpy" className="flex gap-2 items-center">
          <input
            type="number"
            name="new-jpy"
            id="new-jpy"
            className="border outline none px-2 py-1"
            value={currentInputRates.JPY}
            onChange={(e) => {
              const value = Number(e.currentTarget.value);
              setCurrentInputRates((prev) => ({
                ...prev,
                JPY: value,
              }));
            }}
          />
          <p>JPY</p>
        </label>
        <label htmlFor="new-sgd" className="flex gap-2 items-center">
          <input
            type="number"
            name="new-sgd"
            id="new-sgd"
            className="border outline none px-2 py-1"
            value={currentInputRates.SGD}
            onChange={(e) => {
              const value = Number(e.currentTarget.value);
              setCurrentInputRates((prev) => ({
                ...prev,
                SGD: value,
              }));
            }}
          />
          <p>SGD</p>
        </label>
        <label htmlFor="new-usd" className="flex gap-2 items-center">
          <input
            type="number"
            name="new-usd"
            id="new-usd"
            className="border outline none px-2 py-1"
            value={currentInputRates.USD}
            onChange={(e) => {
              const value = Number(e.currentTarget.value);
              setCurrentInputRates((prev) => ({
                ...prev,
                USD: value,
              }));
            }}
          />
          <p>USD</p>
        </label>
        <div
          className="w-max"
          onClick={async () => {
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
          }}
        >
          <Button id="submit-new-rate-dollar" variant="black" label="Update" />
        </div>
      </div>
    </div>
  );
};

export default RateView;
