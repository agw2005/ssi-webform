export const loggerDate = (date: Date = new Date()) => {
  const padder = (timeUnit: number) => timeUnit.toString().padStart(2, "0");

  const y = date.getFullYear();
  const m = padder(date.getMonth() + 1);
  const d = padder(date.getDate());
  const h = padder(date.getHours());
  const min = padder(date.getMinutes());
  const sec = padder(date.getSeconds());
  const millSec = padder(date.getMilliseconds());

  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const offH = padder(Math.floor(Math.abs(offset) / 60));
  const offM = padder(Math.abs(offset) % 60);

  return `${y}-${m}-${d} ${h}:${min}:${sec}:${millSec} (TZ${sign}${offH}:${offM})`;
};

console.log(loggerDate());
