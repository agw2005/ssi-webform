import pensive from "../../assets/images/pensive.webp";

const Spinner = () => (
  <div className="w-16 h-16 border-8 border-black border-t-yellow-400 rounded-full animate-spin"></div>
);

const LoadingFallback = () => {
  return (
    <div className="flex items-center">
      <img src={pensive} alt="pensive.webp" className="w-64" />
      <div className="flex flex-col gap-4 items-center justify-center">
        <Spinner />
        <div className="font-bold w-32 text-center animate-pulse">
          Please wait while we're fetching the website!
        </div>
      </div>
    </div>
  );
};

export default LoadingFallback;
