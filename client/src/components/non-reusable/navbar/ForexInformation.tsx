import formatNumberToString from "../../../helper/formatNumberToString.ts";
import useForex from "../../../hooks/useForex.tsx";

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
              : `${forexInformation?.rates.SGD && formatNumberToString(forexInformation.rates.SGD)} `}
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
              : `${forexInformation?.rates.JPY && formatNumberToString(forexInformation.rates.JPY)} `}
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
              : `${forexInformation?.rates.IDR && formatNumberToString(forexInformation.rates.IDR)} `}
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
              : `${forexInformation?.amount && formatNumberToString(forexInformation.amount)} `}
          <strong>USD</strong>
        </p>
      </div>
    </>
  );
};

export default ForexInformation;
