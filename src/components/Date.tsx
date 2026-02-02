export const generateFormNumber = (): string => {
  const now = new Date();

  const pad = (num: number): string =>
    num.toString().padStart(2, "0");

  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${day}${month}${year}${hours}${minutes}${seconds}`;
};
