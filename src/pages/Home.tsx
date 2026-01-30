import Primitive from "../components/primitive";

const SECTIONS = [
  "MIS",
  "GA & Personnel",
  "Accounting",
  "Purchasing",
  "PSC",
  "BM (HRDC)",
  "RnD",
  "EC QA-QC",
  "EXIM",
  "Material-Control",
  "FG WHSE",
  "EC Equipment Engineering OPTO",
  "EC Production OPTO",
  "EC Process Engineering OPTO",
  "FCS",
  "Process Control",
  "Job Innovation",
  "Product Innovation",
  "Management",
  "EC Equipment Engineering Compound",
  "EC Process Engineering Compound",
  "EC Production Compound",
];

const STATUSES = ["Final Approved", "In Progress", "Rejected"];

const EMPLOYEES = ["Person 1", "Person 2", "Person 3"];

const Home = () => {
  return (
    <Primitive>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <select
            name="filter-section"
            id="filter-section"
            className="py-2 px-4 h-10 rounded-xl border max-w-48"
          >
            <option value="All Section">All Section</option>
            {SECTIONS.map((section, index) => {
              return (
                <option key={index} value={section}>
                  {section}
                </option>
              );
            })}
          </select>
          <select
            name="filter-status"
            id="filter-status"
            className="py-2 px-4 h-10 rounded-xl border"
          >
            <option value="All Status">All Status</option>
            {STATUSES.map((status, index) => {
              return (
                <option key={index} value={status}>
                  {status}
                </option>
              );
            })}
          </select>
          <select
            name="filter-in-charge"
            id="filter-in-charge"
            className="py-2 px-4 h-10 rounded-xl border"
          >
            <option value="Administrator">Administrator</option>
            {EMPLOYEES.map((employee, index) => {
              return (
                <option key={index} value={employee}>
                  {employee}
                </option>
              );
            })}
          </select>
          <div className="flex">
            <div className="border rounded-l-xl h-10 py-2 px-4 bg-black text-white border-black text-center">
              Date from
            </div>
            <input
              type="date"
              id="datefrom"
              name="datefrom"
              className="py-2 px-4 h-10 border outline-none"
            />
            <div className="border h-10 py-2 px-4 bg-black text-white border-black text-center">
              to
            </div>
            <input
              type="date"
              id="dateto"
              name="dateto"
              className="rounded-r-xl py-2 px-4 h-10 border outline-none"
            />
          </div>
          <div className="flex">
            <div className="border rounded-l-xl h-10 py-2 px-4 bg-black text-white border-black text-center select-none">
              Show items
            </div>
            <input
              type="number"
              id="items-quantity"
              name="items-quantity"
              min={1}
              value={1}
              step={1}
              className="rounded-r-xl py-2 px-4 h-10 border outline-none max-w-24 text-center"
            />
          </div>
        </div>
        <div className="flex">
          <input
            type="search"
            id="search"
            name="search"
            placeholder="Search"
            className="border rounded-l-4xl h-10 py-2 px-4 outline-none"
          />
          <button
            type="button"
            className="py-2 px-4 h-10 border rounded-r-4xl hover:text-white hover:bg-black hover:border-black"
          >
            Search
          </button>
        </div>
      </div>
      <ul>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
      </ul>
    </Primitive>
  );
};

export default Home;
