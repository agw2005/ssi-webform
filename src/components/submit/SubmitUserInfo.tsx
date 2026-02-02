import FilterSection from "../FilterSection";

const SubmitUserInfo = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="w-40">Your Name :</label>
        <input className="border p-2 w-64 | px-4 rounded-xl border" />
      </div>

      <div className="flex items-center gap-4">
        <label className="w-40">Your Section :</label>
        <div className="w-64">
          <FilterSection />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-40">Employee No. (NRP) :</label>
        <input className="border p-2 w-64 | px-4 rounded-xl border" />
      </div>

      <div className="flex items-center gap-4">
        <label className="w-40">Ext. No :</label>
        <input className="border p-2 w-32 | px-4 rounded-xl border" />
      </div>

      <div className="flex items-center gap-4">
        <label className="w-40">Your Email Address :</label>
        <input className="border p-2 w-64 | px-4 rounded-xl border" />
        <span className="text-sm">@ssi.sharp-world.com</span>
      </div>
    </div>
  );
};

export default SubmitUserInfo;
