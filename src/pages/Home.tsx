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
      <div className="flex gap-5">
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
      </div>
    </Primitive>
  );
};

export default Home;
