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

const FilterSection = () => {
  return (
    <select
      name="filter-section"
      id="filter-section"
      className="text-xs lg:text-sm xl:text-base | max-w-32 lg:max-w-40 xl:max-w-48 | h-8 lg:h-9 xl:h-10 | py-2 px-4 rounded-xl border"
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
  );
};

export default FilterSection;
