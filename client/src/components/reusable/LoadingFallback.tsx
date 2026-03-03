const LoadingFallback = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-yellow-600/0">
      <div className="w-16 h-16 border-8 border-black border-t-yellow-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingFallback;
