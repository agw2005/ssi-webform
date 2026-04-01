import pensive from "../../assets/images/pensive.webp";

const Spinner = () => (
  <div className="w-8 md:w-10 lg:w-12 xl:w-14 2xl:w-16 | h-8 md:h-10 lg:h-12 xl:h-14 2xl:h-16 | border-3 md:border-5 lg:border-7 xl:border-9 2xl:border-11 | border-black border-t-yellow-400 rounded-full animate-spin">
  </div>
);

const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-self-center">
      <img
        src={pensive}
        alt="pensive.webp"
        className="w-32 md:w-86 lg:w-lg xl:w-lg 2xl:w-160"
      />
      <div className="flex flex-col items-center justify-center">
        <Spinner />
        <div className="w-64 md:w-98 xl:w-lg 2xl:w-xl | sm:text-base md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl | font-bold text-center animate-pulse mt-8 flex flex-col gap-4">
          <span>Loading, please wait!</span>
          <span>読み込み中です。お待​​ちください。</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingFallback;
