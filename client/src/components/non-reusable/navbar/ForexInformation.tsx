import useForex from "../../../hooks/useForex.tsx";

const FOREX_RATES_STRING_FORMAT = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const LOADING_MESSAGE = "(Loading)";
const ERROR_MESSAGE = "(Error)";

const ForexInformation = () => {
  const { forexInformation, isLoading, error } = useForex();

  if (error) {
    console.error(error);
  }

  return (
    <>
      <div className="relative px-4 flex items-center">
        <img
          src="/flag-of-singapore.png"
          alt="singaporean flag"
          className="absolute inset-0 w-full h-full opacity-30 select-none"
        />
        <p className="text-xs lg:text-base | z-1">
          {isLoading
            ? LOADING_MESSAGE
            : error
              ? ERROR_MESSAGE
              : `${forexInformation?.rates.SGD.toLocaleString("en-US", FOREX_RATES_STRING_FORMAT)} `}
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
          {isLoading
            ? LOADING_MESSAGE
            : error
              ? ERROR_MESSAGE
              : `${forexInformation?.rates.JPY.toLocaleString("en-US", FOREX_RATES_STRING_FORMAT)} `}
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
          {isLoading
            ? LOADING_MESSAGE
            : error
              ? ERROR_MESSAGE
              : `${forexInformation?.rates.IDR.toLocaleString("en-US", FOREX_RATES_STRING_FORMAT)} `}
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
          {isLoading
            ? LOADING_MESSAGE
            : error
              ? ERROR_MESSAGE
              : `${forexInformation?.amount.toLocaleString("en-US", FOREX_RATES_STRING_FORMAT)} `}
          <strong>USD</strong>
        </p>
      </div>
    </>
  );
};

export default ForexInformation;
