export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string value");
    }
    return date.toISOString().split("T")[0];
  } catch (err) {
    console.error(err);
  }
};
