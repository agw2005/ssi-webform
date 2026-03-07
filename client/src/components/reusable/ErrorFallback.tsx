import reject from "../../assets/images/reject.webp";

interface ErrorFallbackProps {
  componentName: string;
  errors: Error[];
}

const ErrorFallback = ({ componentName, errors }: ErrorFallbackProps) => {
  return (
    <div className="flex">
      <img src={reject} alt="reject.webp" className="w-64" />
      <div className="flex flex-col justify-center">
        <div>
          Something unexpected happened. ({componentName})<br />
        </div>
        {errors.map((error, index) => (
          <div key={index}>{error.message}</div>
        ))}
      </div>
    </div>
  );
};

export default ErrorFallback;
