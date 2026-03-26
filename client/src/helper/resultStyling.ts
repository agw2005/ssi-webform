export const resultStyling = (status: string) => {
  if (status === "Approved") {
    return "bg-green-300";
  } else if (status === "In Progress") {
    return "bg-yellow-300";
  } else if (status === "Rejected") {
    return "bg-red-700 font-bold text-white border-black";
  } else if (status === "") {
    return "bg-gray-400 font-bold text-gray-900 border-black";
  } else {
    return "bg-black text-black";
  }
};
