import FilterSection from "../../FilterSection.tsx";

const Step1UserInfo = () => {
  return (
    <div className="space-y-4">

      {/* Your Name */}
      <div className="flex items-center gap-4">
        <label className="w-40">
          Your Name <span className="text-red-500">*</span> :
        </label>

        <input
          required
          type="text"
          placeholder="Enter your name"
          className="w-64 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Section */}
      <div className="flex items-center gap-4">
        <label className="w-40">
          Your Section <span className="text-red-500">*</span> :
        </label>

        <div className="w-64">
          {/* Pastikan component ini support required ya */}
          <FilterSection />
        </div>
      </div>

      {/* Employee No */}
      <div className="flex items-center gap-4">
        <label className="w-40">
          Employee No. (NRP) <span className="text-red-500">*</span> :
        </label>

        <input
          required
          type="text"
          placeholder="Enter employee number"
          className="w-64 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Ext */}
      <div className="flex items-center gap-4">
        <label className="w-40">
          Ext. No :
        </label>

        <input
          type="text"
          placeholder="Extension"
          className="w-32 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div className="flex items-center gap-4">
        <label className="w-40">
          Your Email <span className="text-red-500">*</span> :
        </label>

        <div className="flex items-center gap-2">
          <input
            required
            type="text"
            placeholder="username"
            className="w-40 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <span className="text-sm text-gray-600">
            @ssi.sharp-world.com
          </span>
        </div>
      </div>

    </div>
  );
};

export default Step1UserInfo;
