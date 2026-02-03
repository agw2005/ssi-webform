import items from "../../../dummies/ItemPR.json";

interface Item {
  id: number;
  costCenter: string;
  nature: string;
  desc: string;
  qty: number;
  measure: string;
  unitPrice: number;
  currency: string;
  rate: number;
  delivery: string;
  vendor: string;
  reason: string;
  IDBudget: string;
}

const Step3Table = () => {
  const data = items as Item[];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg">
        <thead className="bg-orange-200">
          <tr className="text-sm">
            <th className="p-2">#</th>
            <th>Cost Center</th>
            <th>Nature</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Measure</th>
            <th>Unit Price</th>
            <th>Currency</th>
            <th>Rate</th>
            <th>Est. Delivery</th>
            <th>Vendor</th>
            <th>Reason</th>
            <th>ID Budget</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className="text-center border-t hover:bg-gray-50">
              <td className="p-2">{index + 1}</td>
              <td>{item.costCenter}</td>
              <td>{item.nature}</td>
              <td>{item.desc}</td>
              <td>{item.qty}</td>
              <td>{item.measure}</td>
              <td>{item.unitPrice.toLocaleString()}</td>
              <td>{item.currency}</td>
              <td>{item.rate}</td>
              <td>{item.delivery}</td>
              <td>{item.vendor}</td>
              <td>{item.reason}</td>
              <td>{item.IDBudget}</td>  
              <td>
                <button
                  type="button"
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Step3Table;
