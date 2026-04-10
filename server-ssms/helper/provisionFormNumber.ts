const provisionFormNumber = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");

  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = pad(now.getFullYear());

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${day}${month}${year}${hours}${minutes}${seconds}`;
};

export default provisionFormNumber;
