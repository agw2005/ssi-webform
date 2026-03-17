export const statusStyling = (status: string) => {
  if (status === "Final Approved") {
    return "bg-green-300";
  } else if (status === "In Progress") {
    return "bg-yellow-300";
  } else if (status === "Rejected") {
    return "bg-red-700 font-bold text-white border-black";
  } else if (status === "Cancelled") {
    return "bg-red-950 font-bold text-white border-black";
  } else if (status === "Expired") {
    return "bg-gray-400 font-bold text-gray-900 border-black";
  } else {
    return "bg-black text-black";
  }
};
