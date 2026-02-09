import useForex from "../hooks/useForex";

const FOREX_RATES_STRING_FORMAT = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const ForexInformation = () => {
  const forexInformation = useForex();

  return (
    <>
      <div className="relative px-4 flex items-center">
        <img
          src="/flag-of-singapore.png"
          alt="singaporean flag"
          className="absolute inset-0 w-full h-full opacity-30 select-none"
        />
        <p className="text-xs lg:text-base | z-1">
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
        <p className="text-xs lg:text-base | z-1">
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
        <p className="text-xs lg:text-base | z-1">
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
        <p className="text-xs lg:text-base | z-1">
          {forexInformation?.amount.toLocaleString(
            "en-US",
            FOREX_RATES_STRING_FORMAT,
          ) + " "}
          <strong>{forexInformation?.base}</strong>
        </p>
      </div>
    </>
  );
};

export default ForexInformation;
