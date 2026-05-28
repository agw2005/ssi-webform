export const renameAttachment = (
  filename: string,
  uploadDate: Date,
): string => {
  const pad = (num: number) => num.toString().padStart(2, "0");

  const year = uploadDate.getFullYear().toString().slice(-2);
  const month = pad(uploadDate.getMonth() + 1);
  const date = pad(uploadDate.getDate());
  const hours = pad(uploadDate.getHours());
  const minutes = pad(uploadDate.getMinutes());
  const seconds = pad(uploadDate.getSeconds());

  return `&${year}${month}${date}${hours}${minutes}${seconds}-${filename}`;
};
