const Step3Attention = () => {
  return (
    <div className="bg-gray-200 text-gray-700 p-3 mb-6 text-sm">
      <b>Warning!</b> Input at least 1 item in your PR Form
    <div className="space-y-3 mb-6">

      {/* WARNING INPUT */}
      <div className="bg-gray-200 text-gray-700 p-3 text-sm rounded-md">
        <b>Warning!</b> Input at least 1 item in your PR Form
      </div>

      {/* NEW RED ATTENTION */}
      <div className="border-l-4 border-red-600 bg-red-50 text-red-700 p-4 text-sm rounded-md shadow-sm">
        <b>Beware.</b> Do not let your budget get a red light.
      </div>

    </div>
  );
};

export default Step3Attention;
