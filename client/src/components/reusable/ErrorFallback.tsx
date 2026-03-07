import reject from "../../assets/images/reject.webp";

interface ErrorFallbackProps {
  componentName: string;
  errors: Error[];
}

const ErrorFallback = ({ componentName, errors }: ErrorFallbackProps) => {
  return (
    <div className="flex items-center">
      <img
        src={reject}
        alt="reject.webp"
        className="w-64 md:w-98 lg:w-lg xl:w-164 | h-64 md:h-98 lg:h-128 xl:h-164"
      />
      <div className="w-32 md:w-64 lg:w-86 xl:w-xl 2xl:w-2xl | text-xs md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl | flex flex-col justify-center font-bold">
        <div>
          Something unexpected happened. ({componentName})<br />
          <br />
        </div>
        {errors.map((error, index) => (
          <div key={index}>
            {error.message}
            <br />
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorFallback;
