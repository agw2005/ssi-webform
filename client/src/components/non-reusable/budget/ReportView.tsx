interface ReportViewProps {
  fileResources: string[];
  periods: string[];
}

const ReportView = ({ fileResources, periods }: ReportViewProps) => {
  return (
    <div className="mt-4 flex gap-4 flex-wrap">
      <div className="flex flex-col p-8 bg-gray-100 rounded-2xl items-start flex-1 justify-between">
        <div className="flex flex-col gap-4 items-start">
          <h2 className="text-3xl font-bold text-gray-600">General Report</h2>
          <div className="text-xs tracking-wide bg-gray-600 text-white p-2 rounded-lg">
            Budget Table
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-end">
            <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-gray-600 bg-gray-600 text-white select-none">
              File Resource
            </div>
            <select
              name="general-report-file-resource"
              id="general-report-file-resource"
              className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-gray-600 text-gray-600 bg-white outline-none"
            >
              <option value="Show All">Show All</option>
              {fileResources.map((option, index) => {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-end">
            <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-gray-600 bg-gray-600 text-white select-none">
              Period
            </div>
            <select
              name="general-report-period"
              id="general-report-period"
              className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-gray-600 text-gray-600 bg-white outline-none"
            >
              <option value="Show All">Show All</option>
              {periods.map((option, index) => {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="mt-4 xl:mt-8 | hover:shadow-xl | bg-black/5 hover:bg-black/25 active:bg-white | active:text-black | shadow-md self-center px-4 py-2 border rounded-4xl select-none">
          Show Report
        </div>
      </div>

      <div className="flex flex-col p-8 bg-yellow-100 rounded-2xl items-start flex-1 justify-between">
        <div className="flex flex-col gap-4 items-start">
          <h2 className="text-3xl font-bold text-yellow-600">
            Report by Quarter
          </h2>
          <div className="text-xs tracking-wide bg-yellow-600 text-white p-2 rounded-lg">
            Summary Budget
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-end">
            <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              Month
            </div>
            <input
              type="month"
              name="month"
              id="month"
              className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl text-center border border-yellow-600 text-yellow-600 bg-white outline-none"
            />
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-end">
            <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              File Resource
            </div>
            <select
              name="report-by-quarter-file-resource"
              id="report-by-quarter-file-resource"
              className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-yellow-600 text-yellow-600 bg-white outline-none"
            >
              <option value="Show All">Show All</option>
              {fileResources.map((option, index) => {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="mt-4 xl:mt-8 | hover:shadow-xl | bg-black/5 hover:bg-black/25 active:bg-white | active:text-black | shadow-md self-center px-4 py-2 border rounded-4xl select-none">
          Show Report
        </div>
      </div>

      <div className="flex flex-col p-8 bg-blue-100 rounded-2xl items-start flex-1 justify-between">
        <div className="flex flex-col gap-4 items-start">
          <h2 className="text-3xl font-bold text-blue-600">
            Report by Section
          </h2>
          <div className="text-xs tracking-wide bg-blue-600 text-white p-2 rounded-lg">
            Summary Budget
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-center">
            <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-blue-600 bg-blue-600 text-white select-none">
              Period
            </div>
            <select
              name="report-by-section-period"
              id="report-by-section-period"
              className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-blue-600 text-blue-600 bg-white outline-none"
            >
              <option value="Show All">Show All</option>
              {periods.map((option, index) => {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="mt-4 xl:mt-8 | hover:shadow-xl | bg-black/5 hover:bg-black/25 active:bg-white | active:text-black | shadow-md self-center px-4 py-2 border rounded-4xl select-none">
          Show Report
        </div>
      </div>

      <div className="flex flex-col p-8 bg-green-100 rounded-2xl items-start flex-1 justify-between">
        <div className="flex flex-col gap-4 items-start">
          <h2 className="text-3xl font-bold text-green-600">
            Report by Nature
          </h2>
          <div className="text-xs tracking-wide bg-green-600 text-white p-2 rounded-lg">
            Summary Budget
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-center">
            <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-green-600 bg-green-600 text-white select-none">
              Period
            </div>
            <select
              name="report-by-nature-period"
              id="report-by-nature-period"
              className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-green-600 text-green-600 bg-white outline-none"
            >
              <option value="Show All">Show All</option>
              {periods.map((option, index) => {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="mt-4 xl:mt-8 | hover:shadow-xl | bg-black/5 hover:bg-black/25 active:bg-white | active:text-black | shadow-md self-center px-4 py-2 border rounded-4xl select-none">
          Show Report
        </div>
      </div>
    </div>
  );
};

export default ReportView;
