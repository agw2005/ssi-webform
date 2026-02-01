const SubmitWorkInfo = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="w-40">File Resource :</label>
        <select className="border p-2 w-64">
          <option>Select One</option>
        </select>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-40">Dept :</label>
        <select className="border p-2 w-64">
          <option>Select One</option>
        </select>
      </div>
    </div>
  );
};

export default SubmitWorkInfo;
