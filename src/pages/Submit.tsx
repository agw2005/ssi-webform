import Primitive from "../components/Primitive";
import FilterSection from "../components/FilterSection.tsx";

const Submit = () => {
  return (
    <Primitive>
      <div className="max-w-4xl bg-gray-100 p-6 rounded-md">
        {/* Title */}
        <h1 className="text-xl font-bold mb-2">
          Fill Your Data <span className="text-sm font-normal">Step 1</span>
        </h1>

        {/* Attention box */}
        <div className="bg-gray-200 text-gray-700 p-3 mb-6 text-sm">
          <b>ATTENTION</b> You must fill your data correctly
        </div>

        {/* Form */}
        <form className="space-y-4">
          {/* Your Name */}
          <div className="flex items-center gap-4">
            <label className="w-40">Your Name :</label>
            <input
              type="text"
              className="border p-2 w-64"
            />
          </div>

          {/* Your Section */}
          <div className="flex items-center gap-4">
            <label className="w-40">Your Section :</label>
            <FilterSection />
          </div>

          {/* File Resource */}
          <div className="flex items-center gap-4">
            <label className="w-40">File Resource :</label>
            <select className="border p-2 w-64">
              <option>Select One</option>
            </select>
          </div>

          {/* Employee No */}
          <div className="flex items-center gap-4">
            <label className="w-40">Employee No. (NRP) :</label>
            <input
              type="text"
              className="border p-2 w-64"
            />
          </div>

          {/* Ext No */}
          <div className="flex items-center gap-4">
            <label className="w-40">Ext. No :</label>
            <input
              type="text"
              className="border p-2 w-32"
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-4">
            <label className="w-40">Your Email Address :</label>
            <input
              type="email"
              className="border p-2 w-64"
            />
            <span className="text-sm">@ssi.sharp-world.com</span>
          </div>

          {/* Dept */}
          <div className="flex items-center gap-4">
            <label className="w-40">Dept :</label>
            <select className="border p-2 w-64">
              <option>Select One</option>
            </select>
          </div>

          {/* Select Form */}
          <div className="flex items-start gap-4">
            <label className="w-40">Select Form :</label>
            <div className="flex flex-col gap-1">
              <label><input type="radio" name="form" /> PR</label>
              <label><input type="radio" name="form" /> Cash Advance</label>
              <label><input type="radio" name="form" /> Fixed Asset</label>
            </div>
          </div>

          {/* Next Button */}
          <div className="text-right">
            <button
              type="button"
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </Primitive>
  );
};

export default Submit;
